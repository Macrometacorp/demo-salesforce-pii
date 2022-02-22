export const buildURL = (baseUrl:string, subBaseUrl = "", query = "", rest = "") => {
    const url = `${baseUrl}${subBaseUrl}${query}${rest}`;
    return url;
  };
  
  export const getOptions = (opts:object, token:string, contentType = "application/json") => ({
    ...opts,
    headers: { "Content-type": contentType, Authorization: `Bearer ${token}` },
  });
  
  export const fetchWrapper = async (url:string, methodOptions:object, isUpload = false) => {
    const response = await fetch(url, methodOptions);
    let result;
    if (!isUpload) {
      result = await response.json();
    }
    if (isUpload) {
      result = {};
    }
    result.statusCode = response.status;
    return result;
  };
  