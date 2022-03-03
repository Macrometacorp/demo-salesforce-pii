import { v4 as uuidv4 } from "uuid";
import { Fabrics, MM_TOKEN_PREFIX, Queries } from "~/constants";
import { isPrivateRegion } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiAddContact } from "../pii";
import { saveLeadDatahandler } from "../salesforce";

export default async (request: Request, form: FormData) => {
  const name =
    `${form.get("firstName")?.toString()}:${form
      .get("lastName")
      ?.toString()}` ?? "";
  const firstName = `${form.get("firstName")?.toString()}` ?? "";
  const lastname = `${form.get("lastName")?.toString()}` ?? "";
  const Company = form.get("company")?.toString() ?? "";
  const LeadStatus = form.get("leadStatus")?.toString() ?? "";
  const phone = form.get("phone")?.toString() ?? "";
  const Title = form.get("title")?.toString() ?? "";
  const NumberOfEmployees = form.get("noOfEmployees")?.toString() ?? "";
  const Website = form.get("website")?.toString() ?? "";
  const LeadSource = form.get("leadSource")?.toString() ?? "";
  const Industry = form.get("industry")?.toString() ?? "";
  const email = form.get("email")?.toString() ?? "";
  const Rating = form.get("rating")?.toString() ?? "";
  const Street = form.get("street")?.toString() ?? "";
  const City = form.get("city")?.toString() ?? "";
  const State = form.get("state")?.toString() ?? "";
  const Country = form.get("country")?.toString() ?? "";
  const zipcode = form.get("zipcode")?.toString() ?? "";
  const isPrivate = isPrivateRegion(Country);
  let token = "";
  try {
    if (isPrivate) {
      const piiResponsePromise = await piiAddContact(name, email, phone);
      const piiResponse = await piiResponsePromise.json();
      token = piiResponse.token;
      if (piiResponse?.status === "error") {
        let errorMessage = "Something went wrong. Please try again.";
        switch (piiResponse?.message) {
          case "duplicate index: email":
            errorMessage = `Contact already exists with email ${email}`;
            break;
          case "duplicate index: login":
            errorMessage = `Contact already exists with name ${name}`;
            break;
          case "duplicate index: phone":
            errorMessage = `Contact already exists with phone ${phone}`;
            break;
        }
        throw new Error(errorMessage);
      }
    } else {
      token = token || `${MM_TOKEN_PREFIX}${uuidv4()}`;
      await c8ql(request, Fabrics.Global, Queries.InsertUser(), {
        token,
        name,
        firstName,
        lastname,
        email,
        phone,
      });
    }
    // await c8ql(request, Fabrics.Global, Queries.InsertLocation(), {
    //   token,
    //   state,
    //   country,
    //   zipcode,
    //   title,
    // });
    await saveLeadDatahandler(
      {
        token,
        Company,
        Status: LeadStatus,
        Title,
        NumberOfEmployees,
        Website,
        LeadSource,
        Industry,
        Rating,
        Street,
        City,
        State,
        Country,
        PostalCode: zipcode,
        isUploaded: false,
      },
      token
    );
    return { isPrivate, isAdded: true };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
