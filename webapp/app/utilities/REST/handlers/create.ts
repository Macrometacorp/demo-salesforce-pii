import { v4 as uuidv4 } from "uuid";

import { Fabrics, MM_TOKEN_PREFIX, Queries } from "~/constants";
import { isPrivateRegion } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiAddContact } from "../pii";

export default async (request: Request, form: FormData) => {
  const name = form.get("name")?.toString() ?? "";
  const email = form.get("email")?.toString() ?? "";
  const phone = form.get("phone")?.toString() ?? "";
  const state = form.get("state")?.toString() ?? "";
  const country = form.get("country")?.toString() ?? "";
  const zipcode = form.get("zipcode")?.toString() ?? "";
  const job_title = form.get("job_title")?.toString() ?? "";
  const isPrivate = isPrivateRegion(country);

  let token = "";
  try {
    if (isPrivate) {
      const resText = await piiAddContact(name, email, phone).then((response) =>
        response.text()
      );
      const res = JSON.parse(resText);
      token = res.token;
    } else {
      token = token || `${MM_TOKEN_PREFIX}${uuidv4()}`;
      await c8ql(request, Fabrics.Global, Queries.InsertUser(), {
        token,
        name,
        email,
        phone,
      });
    }
    await c8ql(request, Fabrics.Global, Queries.InsertLocation(), {
      token,
      state,
      country,
      zipcode,
      job_title,
    });
    return { isPrivate, isAdded: true };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
