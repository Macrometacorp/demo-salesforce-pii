import { Fabrics, Queries } from "~/constants";
import { isMMToken } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiDeleteUser } from "../pii";
import { deleteleadListHandler, getCachedData } from "../salesforce";

export default async (
  request: Request,
  form: FormData,
  isApiKey: boolean = false
) => {
  const token = form.get("token")?.toString() ?? "";
  const _key = form.get("_key")?.toString() ?? "";

  const isPrivate = !isMMToken(token);
  try {
    if (isPrivate) {
      const resText = await piiDeleteUser(token).then((response) =>
        response.text()
      );
      // error if expected format is not received
      JSON.parse(resText);
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
    const leadInfoData = await getCachedData();
    const id =leadInfoData.filter((element:any)=>element.token==token)
    const res = await deleteleadListHandler(id[0].Id);
    const locationRes = await c8ql(
      request,
      Fabrics.Global,
      Queries.DeleteUserLeadInfo(),
      {
        token: _key,
      },
      isApiKey
    ).then((request) => request.json());
    if (locationRes?.error) {
      throw new Error(JSON.stringify(locationRes));
    }
    const consentData = await c8ql(
      request,
      Fabrics.Global,
      Queries.DeleteConsentInfo(),
      {
        token,
      },
      isApiKey
    ).then((request) => request.json());
    if (consentData?.error) {
      throw new Error(JSON.stringify(consentData));
    }
    return { isPrivate, isDeleted: true };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
