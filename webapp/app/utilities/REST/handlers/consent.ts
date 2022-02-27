import { c8ql } from "../mm";
import { Fabrics, FormButtonActions, Queries } from "~/constants";

export const updateConsentDetails = async (
  request: Request,
  form: FormData
) => {
  try {
    const token = `${form.get("token")?.toString()}`;
    const consent =
      `${form.get("value")?.toString()}` === "true";
    if (!token) {
      throw new Error("Token name is required");
    }
    await c8ql(
      request,
      Fabrics.Global,
      Queries.InsertUserConsent(),
      {
        token,
        ConsentRequested: consent,
      },
      true
    );
    return { isUpdated: true };
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      errorMessage: error?.message || error?.errorMessage,
      name: error?.name,
    };
  }
};
