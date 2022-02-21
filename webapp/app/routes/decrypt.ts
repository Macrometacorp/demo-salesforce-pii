import type { LoaderFunction } from "remix";
import * as queryString from "query-string";
import { piiGetUserByToken } from "~/utilities/REST/pii";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    query: { token },
  } = queryString.parseUrl(request.url);
  return piiGetUserByToken(token?.toString() || "");
};
