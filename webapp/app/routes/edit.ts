import { ActionFunction, json, LoaderFunction } from "remix";
import { HttpMethods, Session } from "~/constants";
import handleUpdate from "../utilities/REST/handlers/update";

export const action: ActionFunction = async ({ request }) => {
  const { method } = request;
  if (method.toLowerCase() !== HttpMethods.Put) {
    return json({ message: "Method not allowed" }, 405);
  }
  const token = request.headers.get(Session.PiiToken) || "";
  if (!token) {
    return json({ message: "PII token not present. Unauthorized" }, 401);
  }

  const payload = await request.json();
  const { name, email, phone, state, zipcode, job_title } = payload;

  const formData = new FormData();
  formData.set("token", token);
  name && formData.set("name", name);
  email && formData.set("email", email);
  phone && formData.set("phone", phone);
  state && formData.set("state", state);
  zipcode && formData.set("zipcode", zipcode);
  job_title && formData.set("job_title", job_title);

  const res = await handleUpdate(request, formData, true);
  return json(res, res.error ? 500 : 200);
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { host, protocol } = url;
  let piiToken = url.searchParams.get(Session.PiiToken);

  if (!piiToken) {
    return json({ message: "PII token not present." }, 400);
  }

  const curl = `curl -XPUT -H 'pii-token: ${piiToken}' '${protocol}//${host}/edit' -d '{json}'`;

  return json({ message: curl }, 200);
};
