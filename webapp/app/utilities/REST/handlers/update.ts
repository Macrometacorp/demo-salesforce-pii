import { updateleadListHandler } from './../salesforce';
import { Fabrics, Queries } from "~/constants";
import { UserData } from "~/interfaces";
import { isMMToken } from "~/utilities/utils";
import { buildURL, fetchWrapper, getOptions } from "../apiCalls";
import { c8ql } from "../mm";
import { piiUpdateContact } from "../pii";

export default async (
  request: Request,
  form: FormData,
  isApiKey: boolean = false
) => {
  const name =
    `${form.get("firstName")?.toString()}:${form
      .get("lastName")
      ?.toString()}` ?? "";
  const firstName = `${form.get("firstName")?.toString()}` ?? "";
  const lastname = `${form.get("lastName")?.toString()}` ?? "";
  const Company = form.get("company")?.toString() ?? "";
  const Status = form.get("leadStatus")?.toString() ?? "";
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
  const PostalCode = form.get("zipcode")?.toString() ?? "";
  const token = form.get("token")?.toString() || "";
  const Id = form.get("Id")?.toString() || "";
  const IsUnreadByOwner = form.get("IsUnreadByOwner")?.toString() || "";
  const isUploaded = form.get("isUploaded")?.toString() === "true";
  const isEditable = true;
  const isPrivate = !isMMToken(token);
  const _key = form.get("_key")?.toString() ?? "";
  try {
    if (isPrivate) {
      const resText = await piiUpdateContact(token, name, email, phone).then(
        (response) => response.text()
      );
      // error if expected format is not received
      JSON.parse(resText);
    } else {

      const whatToUpsert = [];
      name && whatToUpsert.push("firstName: @firstName");
      name && whatToUpsert.push("lastname: @lastname");
      name && whatToUpsert.push("name: @name");
      email && whatToUpsert.push("email: @email");
      phone && whatToUpsert.push("phone: @phone");

      if (whatToUpsert.length) {
        const upsertStr = whatToUpsert.length ? whatToUpsert.join(",") : "";

        const res = await c8ql(
          request,
          Fabrics.Global,
          Queries.UpdateUser(upsertStr),
          {
            token,
            name,
            firstName,
            lastname,
            email,
            phone,
          },
          true
        );
        const jsonRes = await res.json();
        if (jsonRes?.error) {
          throw new Error(JSON.stringify(jsonRes));
        }
      }
    }

    const userLeadInfoData = 
      {
        _key,
        value: [
          {
            Id,
            IsUnreadByOwner,
            isUploaded,
            State,
            Country,
            Company,
            Status,
            PostalCode,
            Title,
            NumberOfEmployees,
            Website,
            LeadSource,
            Industry,
            Rating,
            Street,
            City,
            isEditable,
            token,
          },
        ],
      }

const updateSalesforceLeadData = await updateleadListHandler(request,Id,userLeadInfoData);
    return { isPrivate, isUpdated: true };
  } catch (error: any) {
    console.error(error);
    return {
      error: true,
      errorMessage: error?.message || error?.errorMessage,
      name: error?.name,
    };
  }
};
