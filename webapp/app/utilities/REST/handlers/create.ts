import { v4 as uuidv4 } from "uuid";

import { Fabrics, MM_TOKEN_PREFIX, Queries } from "~/constants";
import { isPrivateRegion } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiAddContact } from "../pii";
import { saveLeadDatahandler } from "../salesforce";

export default async (request: Request, form: FormData) => {
  const name = `${form.get("firstName")?.toString()}:${form.get("lastName")?.toString()}` ?? "";
  const company = form.get("company")?.toString() ?? "";
  const leadStatus = form.get("leadStatus")?.toString() ?? "";
  const phone = form.get("phone")?.toString() ?? "";
  const title = form.get("title")?.toString() ?? "";
  const noOfEmployees = form.get("noOfEmployees")?.toString() ?? "";
  const website = form.get("website")?.toString() ?? "";
  const leadSource = form.get("leadSource")?.toString() ?? "";
  const industry = form.get("industry")?.toString() ?? "";
  const email = form.get("email")?.toString() ?? "";
  const rating = form.get("rating")?.toString() ?? "";
  const street = form.get("street")?.toString() ?? "";
  const city = form.get("city")?.toString() ?? "";
  const state = form.get("state")?.toString() ?? "";
  const country = form.get("country")?.toString() ?? "";
  const zipcode = form.get("zipcode")?.toString() ?? "";
  const isPrivate = isPrivateRegion(country);
  let token = "";
 






 const res = await saveLeadDatahandler({name,company,leadStatus,phone,title,NumberOfEmployees:noOfEmployees,website,leadSource,industry,email,rating,street,city,state,country,postalCode:zipcode})
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
      title,
    });
    return { isPrivate, isAdded: true };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
