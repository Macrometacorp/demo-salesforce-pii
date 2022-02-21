import { Fabrics, Queries } from "~/constants";
import { isMMToken } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiDeleteUser } from "../pii";

export default async (
  request: Request,
  form: FormData,
  isApiKey: boolean = false
) => {
  const token = form.get("token")?.toString() ?? "";

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
    return { isPrivate, isDeleted: true };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
