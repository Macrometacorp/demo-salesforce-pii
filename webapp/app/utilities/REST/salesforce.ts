import mmcache from "macrometa-realtime-cache";
import { buildURL, fetchWrapper, getOptions } from "./apiCalls";
import { Parser } from "json2csv";
import { createJobBody, optionsObj, Queries } from "~/constants";

let token = ''

const CREATE_JOB_URL = `${SALESFORCE_INSTANCE_URL}${SALESFORCE_INSTANCE_SUB_URL}${SALESFORCE_JOB_INGEST}`;

const cache = new (mmcache as any)({
    url: 'https://gdn.paas.macrometa.io',
    apiKey:MM_API_KEY ,
    name:'pii_users',
    fabricName:'pii_global_sf'
  });

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
    token = response.access_token;
    return token;
  };

  async function bulkLeadRecordUpdate() {
    try {
      let cachedSavedData = await cache.getResponse({ url: "saveData" });
      await getAccessToken();
      const parser = new Parser();
      const csv = parser.parse(cachedSavedData.value);
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
        console.error("the error", error);
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
  }
  async function deleteStaleCacheHandler() {
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
  }
  
  const getresponse = async () => {
    let data;
    try {
      const cacheResponse = await cache.getResponse({ url: 'cachedSFResponse' });
      data = cacheResponse.value;
    } catch (err:any) {
      if (err.error && err.code === 404) {
        await getAccessToken();
        let handlerResponse = await leadListHandler();
        data = await handlerResponse.json();
        if (data.statusCode !== 401) {
          try {
            await cache.setResponse({
              url: 'cachedSFResponse',
              data,
              ttl: 10800,
            });
          } catch (err) {
            console.error("erro", err);
          }
        }
      }
    }
  
    return new Response(JSON.stringify(data), optionsObj);
  };
  
  async function leadListHandler() {
    const  query  = Queries.SalesforceLeadQuery();
    const getUrl = buildURL(
      SALESFORCE_INSTANCE_URL,
      SALESFORCE_INSTANCE_SUB_URL,
      "/query",
      `?q=${query}`
    );
    const methodOptions = getOptions({ method: "GET" }, token);
    const response = await fetchWrapper(getUrl, methodOptions);
    const body = JSON.stringify(response);
    return new Response(body, optionsObj);
  }

  async function saveLeadDatahandler(leadValues:object) {
    const newLeadPayload =leadValues;
    let data;
  
    try {
      let newLeadCachedResponse = await cache.getResponse({ url: "saveData" });
      newLeadCachedResponse.value.push(newLeadPayload); //normal  json
      data = newLeadCachedResponse.value;
    } catch (error) {
      data = [newLeadPayload];
    } finally {
      await cache.setResponse({
        url: "saveData",
        data,
        ttl: -1,
      });
      return new Response(JSON.stringify({ status: 200 }), optionsObj);
    }
  }

  async function newLeadCachedResponseHandler() {
    try {
      const newLeadCachedResponse = await cache.getResponse({ url: "saveData" });
      return new Response(
        JSON.stringify({ value: newLeadCachedResponse.value }),
        optionsObj
      );
    } catch (error) {
      return new Response(JSON.stringify({ value: [] }), optionsObj);
    }
  }