import { Fabrics, Queries } from "~/constants";
import { isMMToken } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiUpdateContact } from "../pii";

export default async (
  request: Request,
  form: FormData,
  isApiKey: boolean = false
) => {
  const name = form.get("name")?.toString();
  const email = form.get("email")?.toString();
  const phone = form.get("phone")?.toString();
  const state = form.get("state")?.toString();
  const country = form.get("country")?.toString();
  const zipcode = form.get("zipcode")?.toString();
  const job_title = form.get("job_title")?.toString();

  const token = form.get("token")?.toString() || "";

  const isPrivate = !isMMToken(token);

  try {
    if (isPrivate) {
      const resText = await piiUpdateContact(token, name, email, phone).then(
        (response) => response.text()
      );
      // error if expected format is not received
      JSON.parse(resText);
    } else {
      // "{ name: @name, email: @email, phone: @phone }"
      const whatToUpsert = [];
      name && whatToUpsert.push("name: @name");
      email && whatToUpsert.push("email: @email");
      phone && whatToUpsert.push("phone: @phone");

      if (whatToUpsert.length) {
        // user details really need to be updated
        const upsertStr = whatToUpsert.length ? whatToUpsert.join(",") : "";

        const res = await c8ql(
          request,
          Fabrics.Global,
          Queries.UpdateUser(upsertStr),
          {
            token,
            name,
            email,
            phone,
          },
          isApiKey
        );
        const jsonRes = await res.json();
        if (jsonRes?.error) {
          throw new Error(JSON.stringify(jsonRes));
        }
      }
    }

    // "{ state: @state, country: @country, zipcode: @zipcode, job_title: @job_title }"
    const whatLocationDetailsToUpsert = [];
    state && whatLocationDetailsToUpsert.push("state: @state");
    country && whatLocationDetailsToUpsert.push("country: @country");
    zipcode && whatLocationDetailsToUpsert.push("zipcode: @zipcode");
    job_title && whatLocationDetailsToUpsert.push("job_title: @job_title");

    if (whatLocationDetailsToUpsert.length) {
      // location really needs to change
      const locationUpsertStr = whatLocationDetailsToUpsert.length
        ? whatLocationDetailsToUpsert.join(",")
        : "";
      const locationRes = await c8ql(
        request,
        Fabrics.Global,
        Queries.UpdateLocation(locationUpsertStr),
        {
          token,
          state,
          country,
          zipcode,
          job_title,
        },
        isApiKey
      );
      const locationJsonRes = await locationRes.json();
      if (locationJsonRes?.error) {
        throw new Error(JSON.stringify(locationJsonRes));
      }
    }

    return { isPrivate, isUpdated: true };
  } catch (error: any) {
    return {
      error: true,
      errorMessage: error?.message || error?.errorMessage,
      name: error?.name,
    };
  }
};
