import { Fabrics, Queries } from "~/constants";
import { isMMToken } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiDeleteUser, piiForgetUser } from "../pii";

export default async (
  request: Request,
  form: FormData,
  isApiKey: boolean = false
) => {
  const token = form.get("token")?.toString() ?? "";

  const isPrivate = !isMMToken(token);
  let exptoken;
  try {
    if (isPrivate) {
      const resText = await piiForgetUser(token).then((response) =>
        response.text()
      );
      // error if expected format is not received
      console.log(resText);
      const res = JSON.parse(resText);
      exptoken = res.exptoken;
    } else {
      const userRes = await c8ql(
        request,
        Fabrics.Global,
        Queries.DeleteUser(),
        {
          token,
        },
        isApiKey
      ).then((request) => request.json());
      if (userRes?.error) {
        throw new Error(JSON.stringify(userRes));
      }
    }

    const locationRes = await c8ql(
      request,
      Fabrics.Global,
      Queries.DeleteLocation(),
      {
        token,
      },
      isApiKey
    ).then((request) => request.json());
    if (locationRes?.error) {
      throw new Error(JSON.stringify(locationRes));
    }
    const finalResp: {
      isPrivate: boolean;
      exptoken?: string;
      error?: boolean;
    } = { isPrivate };
    if (exptoken) {
      finalResp.exptoken = exptoken;
    }
    return finalResp;
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
