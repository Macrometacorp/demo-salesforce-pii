import { parse, ParseError } from "papaparse";
import { UserData } from "~/interfaces";
import handleCreate from "./create";

export default async (request: Request, form: FormData) => {
  try {
    const upload = form.get("upload")?.toString() ?? "";
    const parsedJSON = parse(upload, { header: true });
    const users: Array<UserData> = parsedJSON.data as Array<UserData>;
    const errors: Array<ParseError> = parsedJSON.errors;

    if (Array.isArray(errors) && errors.length) {
      const err = errors[0];
      return { error: true, errorMessage: err.message, name: err?.code };
    } else {
      const allFormData: Array<FormData> = [];
      users.forEach((user) => {
        const { name, email, phone, state, country, zipcode, job_title } = user;
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("phone", phone);
        formData.set("state", state);
        formData.set("country", country);
        formData.set("zipcode", zipcode);
        formData.set("job_title", job_title);
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
