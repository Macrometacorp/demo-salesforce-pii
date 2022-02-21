import type { LoaderFunction } from "remix";
import { piiGetShareableRecord } from "~/utilities/REST/pii";
import * as queryString from "query-string";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    query: { token },
  } = queryString.parseUrl(request.url);
    const result = await piiGetShareableRecord(token?.toString() || "");
    const shareableRecordResult = await result.text(); 
    const parsedShareableTokenResult = JSON.parse(shareableRecordResult);
    return parsedShareableTokenResult
};
