import { parse, ParseError } from "papaparse";
import { CsvUserData, UserData } from "~/interfaces";
import handleCreate from "./create";

export default async (request: Request, form: FormData) => {
  try {
    const upload = form.get("upload")?.toString() ?? "";
    const parsedJSON = parse(upload, { header: true });
    const users: Array<CsvUserData> = parsedJSON.data as Array<CsvUserData>;
    const errors: Array<ParseError> = parsedJSON.errors;

    if (Array.isArray(errors) && errors.length) {
      const err = errors[0];
      return { error: true, errorMessage: err.message, name: err?.code };
    } else {
      const allFormData: Array<FormData> = [];
      users.forEach((user) => {
        const {
          name,
          firstname,
          lastname,
          email,
          numberOfEmployees,
          phone,
          city,
          street,
          company,
          state,
          country,
          website,
          postalCode,
          title,
          leadSource,
          status,
          rating,
          industry
        } = user;
        const formData = new FormData();
        formData.set("name", name);
        formData.set("firstName", firstname);
        formData.set("lastName", lastname);
        formData.set("email", email);
        formData.set("phone", phone);
        formData.set("city", city);
        formData.set("street", street);
        formData.set("company", company);
        formData.set("website", website);
        formData.set("state", state);
        formData.set("country", country);
        formData.set("zipcode", postalCode);
        formData.set("title", title);
        formData.set("leadSource", leadSource);
        formData.set("leadStatus", status);
        formData.set("rating", rating);
        formData.set("noOfEmployees", numberOfEmployees);
        formData.set("industry", industry);
        allFormData.push(formData);
      });
 
      for (let i = 0; i < allFormData.length; ++i) {
        const createRes = await handleCreate(request, allFormData[i]);
        console.log(createRes);
        console.log(`Uploaded for ${allFormData[i].get("name")}`);
      }
      // some of the records maybe private
      return { isPrivate: true, isAdded: true };
    }
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
