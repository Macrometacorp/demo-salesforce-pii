import mmcache from "macrometa-realtime-cache";
import { buildURL, fetchWrapper, getOptions } from "./apiCalls";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import {
  Collections,
  createJobBody,
  Fabrics,
  optionsObj,
  Queries,
} from "~/constants";
import Client from "macrometa-realtime-cache/lib/cjs/client";
import { c8ql } from "./mm";

class MMCache {
  private static instance: Client;
  private constructor() {
    MMCache.instance = new (mmcache as any)({
      url: "https://gdn.paas.macrometa.io",
      apiKey: MM_API_KEY,
      name: Collections.UserLeadInfo,
      fabricName: Fabrics.Global,
    });
  }

  static get Instance(): Client {
    if (!MMCache?.instance) new this();
    return MMCache.instance;
  }

  static get jobUrl(): string {
    return `${SALESFORCE_INSTANCE_URL}${SALESFORCE_INSTANCE_SUB_URL}${SALESFORCE_JOB_INGEST}`;
  }
}

export const getAccessToken = async () => {
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

export const getCachedData = async () => {
  const keys = await MMCache.Instance.allKeys();
  const cachedSavedData: any = [];
  const keysResult = keys.result;
  for (const key of keysResult) {
    const contents = await MMCache.Instance.get(key);
    cachedSavedData.push(contents.value[0]);
  }
  return cachedSavedData;
};

export const executeQuery = async (queryString:string,bindVars:any) => {
  const result = await fetch(
    `${FEDERATION_URL}/_fabric/pii_global_sf/_api/cursor`,
    {
      method: "POST",
      headers: {
        Authorization: `apikey ${MM_API_KEY}`,
      },
      body: JSON.stringify({
        query:queryString,
        bindVars:bindVars,
      }),
    }
  );
  const queryResult = await result.json();
  return queryResult;
};

export const bulkLeadRecordUpdate = async () => {
  try {
    const keys = await MMCache.Instance.allKeys();
    const cachedSavedData: any = [];
    const keysResult = keys.result;
    for (const key of keysResult) {
      const contents = await MMCache.Instance.get(key);
      delete contents.value[0]["isEditable"];
      if (!contents.value[0]["isUploaded"]) {
        delete contents.value[0]["isUploaded"];
        const queryResult = await executeQuery( "For doc in users filter doc.token==@token return {email:doc.email,name:doc.name,phone:doc.phone,token:doc.token,firstName:doc.firstName,lastname:doc.lastname}",{ token: contents.value[0]["token"] })
        if (queryResult.result.length > 0) {
          delete queryResult.result[0]["name"];
          const combinedLeadData = {
            ...queryResult.result[0],
            ...contents.value[0],
          };
          delete combinedLeadData["token"];
          cachedSavedData.push(combinedLeadData);
        }
      }
    } //end of for
    const token = await getAccessToken();
    const csv = Papa.unparse(cachedSavedData);
    const methodOptions = getOptions(
      { method: "POST", body: createJobBody },
      token
    );
    const createJobResult = await fetchWrapper(MMCache.jobUrl, methodOptions);
    const jobId = createJobResult.id;
    console.log("jobID", jobId);
    let uploadBulkApi;
    try {
      const methodOptions = getOptions(
        { method: "PUT", body: csv },
        token,
        "text/csv"
      );
      const getUrl = buildURL(MMCache.jobUrl, `${jobId}/batches`);
      uploadBulkApi = await fetchWrapper(getUrl, methodOptions, true);
    } catch (error) {
      console.error("the errors", error);
    }
    if (uploadBulkApi.statusCode === 201) {
      const methodOptions = getOptions(
        { method: "PATCH", body: JSON.stringify({ state: "UploadComplete" }) },
        token
      );
      const getUrl = buildURL(MMCache.jobUrl, jobId);
      const closeJob = await fetchWrapper(getUrl, methodOptions);
      console.log("closeJob", closeJob);
     // await refreshCache();
      return new Response(
        JSON.stringify({ message: "Data Uploaded" }),
        optionsObj
      );
    }
    return { isBulkUpload: true };
  } catch (err) {
    throw err;
    // return new Response("No data to upload");
  }
};

export const deleteStaleCacheHandler = async () => {
  try {
  const allKeyResult = await MMCache.Instance.clear();
  console.log("allL",allKeyResult)
  // for (const keys of allKeyResult.result) {

  //     await MMCache.Instance.delete(keys);

  // }
  return new Response(JSON.stringify({ message: "Cache Cleared" }), optionsObj);
} catch (error) {
  console.error("error", error);
  throw error;
}
 
};

// export const getresponse = async (token: string) => {
//   let data;
//   try {
//     const cacheResponse = await MMCache.Instance.getResponse({
//       url: token,
//     });
//     data = cacheResponse.value;
//   } catch (err: any) {
//     if (err.error && err.code === 404) {
//       await getAccessToken();
//       let handlerResponse = await leadListHandler();
//       data = await handlerResponse.json();
//       if (data.statusCode !== 401) {
//         try {
//           await MMCache.Instance.setResponse({
//             url: token,
//             data,
//             ttl: 10800,
//           });
//         } catch (err) {
//           console.error("error", err);
//         }
//       }
//     }
//   }
//   return new Response(JSON.stringify(data), optionsObj);
// };

export const deleteleadListHandler = async (id: string) => {
  const getUrl = buildURL(
    SALESFORCE_INSTANCE_URL,
    SALESFORCE_INSTANCE_SUB_URL,
    "/sobjects/Lead/",
    `${id}`
  );
  const token = await getAccessToken();
  const methodOptions = getOptions({ method: "DELETE" }, token);
  const response = await fetchWrapper(getUrl, methodOptions,true);
   const body = JSON.stringify(response);
  return new Response(body, optionsObj);
};

export const saveLeadDatahandler = async (
  leadValues: object,
  token: string
) => {
  const newLeadPayload = leadValues;
  let data;
  try {
    let newLeadCachedResponse = await MMCache.Instance.getResponse({
      url: token,
    });
    newLeadCachedResponse.value.push(newLeadPayload); //normal  json
    data = newLeadCachedResponse.value;
  } catch (error) {
    data = [newLeadPayload];
  } finally {
    await MMCache.Instance.setResponse({
      url: token,
      data,
      ttl: -1,
    });
    return new Response(JSON.stringify({ status: 200 }), optionsObj);
  }
};

export const newLeadCachedResponseHandler = async (token: string) => {
  try {
    const newLeadCachedResponse = await MMCache.Instance.getResponse({
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

export const getCachedContent = async () => {
  try {
    const keys = await MMCache.Instance.allKeys();
    const cachedSavedData: any = [];
    const keysResult = keys.result;
    for (const key of keysResult) {
      console.log("key", key);
      const contents = await MMCache.Instance.get(key);
      console.log("contents", contents);
      cachedSavedData.push(contents.value[0]);
    }

    return { keys: keysResult, cachedContent: cachedSavedData };
  } catch (error: any) {
    console.log("error", error);
    return {
      error: true,
      errorMessage:
        error?.message || "Something went wrong while updating cache",
      name: error?.name || "Error",
    };
  }
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
  console.log("token", token);
  const methodOptions = getOptions({ method: "GET" }, token);
  const response = await fetchWrapper(getUrl, methodOptions);
  console.log("res", response);
  return response;
  // const body = JSON.stringify(response);
  // return new Response(body, optionsObj);
};


export const updateleadListHandler = async (
  request: Request,
  id: string,
  data: any
) => {
  try {
    //update in cache
    const userLeadInfo = await c8ql(
      request,
      Fabrics.Global,
      Queries.UpdateUserLeadInfo(),
      data,
      true
    );
    const userLeadInfoJsonRes = await userLeadInfo.json();
    console.log("userLeadInfoJsonRes", userLeadInfoJsonRes);
    if (userLeadInfoJsonRes?.error) {
      throw new Error(JSON.stringify(userLeadInfoJsonRes));
    }
    const token = await getAccessToken();
    console.log("toBeUpdatedSalesforceLeadDatatoken ", token);
    const userData = await c8ql(
      request,
      Fabrics.Global,
      Queries.SearchUserByToken(),
      {
        token,
      },
      true
    );
    const result: any = await userData.json();
    console.log("toBeUpdatedSalesforceLeadData", result);
    console.log("result", result);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(null);
      }, 300);
    });

    const toBeUpdatedSalesforceLeadData = JSON.stringify({
      FirstName: result.result[0]?.firstName,
      LastName: result.result[0]?.lastname,
      email: result.result[0]?.email,
      phone: result.result[0]?.phone,
      IsUnreadByOwner: data.value[0].IsUnreadByOwner,
      State: data.value[0].State,
      Country: data.value[0].Country,
      Company: data.value[0].Company,
      Status: data.value[0].Status,
      PostalCode: data.value[0].PostalCode,
      Title: data.value[0].Title,
      NumberOfEmployees: data.value[0].NumberOfEmployees,
      Website: data.value[0].Website,
      LeadSource: data.value[0].LeadSource,
      Industry: data.value[0].Industry,
      Rating: data.value[0].Rating,
      Street: data.value[0].Street,
      City: data.value[0].City,
    });
    
    console.log("toBeUpdatedSalesforceLeadData", toBeUpdatedSalesforceLeadData);
    const getUrl = buildURL(
      SALESFORCE_INSTANCE_URL,
      SALESFORCE_INSTANCE_SUB_URL,
      "/sobjects/Lead/",
      `${id}`
    );
    console.log("7url", getUrl);
    const response = await fetch(getUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: toBeUpdatedSalesforceLeadData,
    });
    return response;
  } catch (error: any) {
    console.log("error", error);
    return {
      error: true,
      errorMessage:
        error?.message || "Something went wrong while updating cache",
      name: error?.name || "Error",
    };
  }
};

export const refreshCache = async () => {
  try {
    const { keys, cachedContent } = await getCachedContent();
    console.log("cachedContent", cachedContent);
    //  await deleteStaleCacheHandler();
    const result = await leadListHandler();
    console.log("leadListHandler", result);
    // const res = await result.json();

    const notUploadedCachedData = cachedContent.filter(
      (elem: any) => !elem.isUploaded
    );
    // for (const cac of notUploadedCachedData) {
    //   const res = await MMCache.Instance.setResponse({
    //     url: cac.token,
    //     data: [cac],
    //     ttl: -1,
    //   });
    // }
    let temp = [];
    for (const ks of result.records) {
      delete ks.attributes;
      delete ks.Salutation;
      const queryResult = await executeQuery( "For doc in users filter doc.email==@email return {token:doc.token}", { email: ks.Email });
     const token= queryResult.result[0] ?? { token: `sf_${uuidv4()}` }
      let data = { ...ks, ...token, isUploaded: true };
      temp.push(data);
    }
    console.log("templeadListHandler", temp);
    const newData = [...notUploadedCachedData,...temp];
    console.log("new cached data", newData);
    for (const ks of newData) {
      const res = await MMCache.Instance.setResponse({
        url: ks.token,
        data: [ks],
        ttl: -1,
      });
    }
    return { isRefresh: true };
  } catch (error: any) {
    return {
      error: true,
      errorMessage:
        error?.message || "Something went wrong while updating cache",
      name: error?.name || "Error",
    };
  }
};
