import mmcache from "macrometa-realtime-cache";
import { buildURL, fetchWrapper, getOptions } from "./apiCalls";
import Papa from "papaparse";
import {
  Collections,
  createJobBody,
  Fabrics,
  optionsObj,
  Queries,
} from "~/constants";
import { c8ql } from "./mm";

const cache = new (mmcache as any)({
  url: "https://gdn.paas.macrometa.io",
  apiKey: MM_API_KEY,
  name: Collections.UserLeadInfo,
  fabricName: Fabrics.Global,
});

const CREATE_JOB_URL = `${SALESFORCE_INSTANCE_URL}${SALESFORCE_INSTANCE_SUB_URL}${SALESFORCE_JOB_INGEST}`;

const getAccessToken = async () => {
  const getUrl = buildURL(
    SALESFORCE_LOGIN_URL,
    "/services/oauth2",
    "/token",
    `?grant_type=password&client_id=${SALESFORCE_CLIENT_ID}&client_secret=${SALESFORCE_CLIENT_SECRET}&username=${SALESFORCE_USERNAME}&password=${SALESFORCE_PASSWORD}`
  );
  const methodOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetchWrapper(getUrl, methodOptions);
  const token = response.access_token;
  return token;
};

export const bulkLeadRecordUpdate = async () => {
  try {
    const keys= await cache.allKeys()

    const cachedSavedData:any=[]
    const keysResult= keys.result
    for (const key of keysResult) {
      const contents = await cache.get(key);
      delete contents.value[0]['isUploaded']
    const result= await  fetch(`${FEDERATION_URL}/_fabric/pii_global_sf/_api/cursor`, {
        method: "POST",
        headers: {
          Authorization: `apikey ${MM_API_KEY}`,
        },
        body: JSON.stringify({query: 'For doc in users filter doc.token==@token return {email:doc.email,name:doc.name,phone:doc.phone,token:doc.token,firstName:doc.firstName,lastname:doc.lastname}',bindVars: {token:contents.value[0]['token']} }),

      });
      const queryResult=await result.json()
      delete queryResult.result[0]['name']
      const combinedLeadData={...queryResult.result[0],...contents.value[0]}
      delete combinedLeadData['token']
      cachedSavedData.push(combinedLeadData)
     
    }  
    const token = await getAccessToken();
    const csv = Papa.unparse(cachedSavedData);
    const methodOptions = getOptions(
      { method: "POST", body: createJobBody },
      token
    );
    const createJobResult = await fetchWrapper(CREATE_JOB_URL, methodOptions);
    const jobId = createJobResult.id;
    let uploadBulkApi;
    try {
      const methodOptions = getOptions(
        { method: "PUT", body: csv },
        token,
        "text/csv"
      );
      const getUrl = buildURL(CREATE_JOB_URL, `${jobId}/batches`);
      uploadBulkApi = await fetchWrapper(getUrl, methodOptions, true);
    } catch (error) {
      console.error("the errors", error);
    }
    if (uploadBulkApi.statusCode === 201) {
      const methodOptions = getOptions(
        { method: "PATCH", body: JSON.stringify({ state: "UploadComplete" }) },
        token
      );
      const getUrl = buildURL(CREATE_JOB_URL, jobId);
      const closeJob = await fetchWrapper(getUrl, methodOptions);
      return new Response(
        JSON.stringify({ message: "Data Uploaded" }),
        optionsObj
      );
    }
  } catch (err) {
    throw err;
    // return new Response("No data to upload");
  }
};

export const deleteStaleCacheHandler = async () => {
  const allKeyResult = await cache.allKeys();
  for (const keys of allKeyResult.result) {
    try {
      await cache.delete(keys);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }
  return new Response(JSON.stringify({ message: "Cache Cleared" }), optionsObj);
};

export const getresponse = async (token:string) => {
  let data;
  try {
    const cacheResponse = await cache.getResponse({ url: token });
    data = cacheResponse.value;
  } catch (err: any) {
    if (err.error && err.code === 404) {
      await getAccessToken();
      let handlerResponse = await leadListHandler();
      data = await handlerResponse.json();
      if (data.statusCode !== 401) {
        try {
          await cache.setResponse({
            url: token,
            data,
            ttl: 10800,
          });
        } catch (err) {
          console.error("error", err);
        }
      }
    }
  }

  return new Response(JSON.stringify(data), optionsObj);
};

export const leadListHandler = async () => {
  const query = Queries.SalesforceLeadQuery();
  const getUrl = buildURL(
    SALESFORCE_INSTANCE_URL,
    SALESFORCE_INSTANCE_SUB_URL,
    "/query",
    `?q=${query}`
  );
  const token = await getAccessToken();
  const methodOptions = getOptions({ method: "GET" }, token);
  const response = await fetchWrapper(getUrl, methodOptions);
  const body = JSON.stringify(response);
  return new Response(body, optionsObj);
};

export const saveLeadDatahandler = async (leadValues: object,token:string) => {
  const newLeadPayload = leadValues;
  let data;

  try {
    let newLeadCachedResponse = await cache.getResponse({
      url: token,
    });
    newLeadCachedResponse.value.push(newLeadPayload); //normal  json
    data = newLeadCachedResponse.value;
  } catch (error) {
    data = [newLeadPayload];
  } finally {
    await cache.setResponse({
      url: token,
      data,
      ttl: -1,
    });
    return new Response(JSON.stringify({ status: 200 }), optionsObj);
  }
};

export const newLeadCachedResponseHandler = async (token:string) => {
  try {
    const newLeadCachedResponse = await cache.getResponse({
      url: token,
    });
    return new Response(
      JSON.stringify({ value: newLeadCachedResponse.value }),
      optionsObj
    );
  } catch (error) {
    return new Response(JSON.stringify({ value: [] }), optionsObj);
  }
};

export const refreshCache = async () => {
  // try {
  //   await deleteStaleCacheHandler();
  //   await getresponse(token);
  //   return { isRefresh: true };
  // } catch (error:any) {
  //   return { error: true, errorMessage: error?.message || "Something went wrong while updating cache", name: error?.name || "Error" };
  // }
};
