import { ActionFunction, json, LoaderFunction } from "remix";
import { HttpMethods, Session } from "~/constants";
import handleForget from "../utilities/REST/handlers/forget";

export const action: ActionFunction = async ({ request }) => {
  const { method } = request;
  if (method.toLowerCase() !== HttpMethods.Delete) {
    return json({ message: "Method not allowed" }, 405);
  }
  const token = request.headers.get(Session.PiiToken) || "";
  if (!token) {
    return json({ message: "PII token not present. Unauthorized" }, 401);
  }

  const formData = new FormData();
  formData.set("token", token);
  const res = await handleForget(request, formData, true);
  return json(res, res.error ? 500 : 200);
};

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const { host, protocol } = url;
  let piiToken = url.searchParams.get(Session.PiiToken);

  if (!piiToken) {
    return json({ message: "PII token not present." }, 400);
  }

  const curl = `curl -XDELETE -H 'pii-token: ${piiToken}' '${protocol}//${host}/forget'`;

  return json({ message: curl }, 200);
};
