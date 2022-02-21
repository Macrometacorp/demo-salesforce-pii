import { Fabrics, Queries } from "~/constants";
import { LocationData, PiiData, UserData } from "~/interfaces";
import { isMMToken } from "~/utilities/utils";
import { c8ql } from "../mm";
import { piiSearchByEmail } from "../pii";

export const searchForEmail = async (
  request: Request,
  email: string,
  isApiKey: boolean = false
) => {
  let token;
  let user;
  // check PII
  const textRes = await piiSearchByEmail(email.toString())
    .then((response) => response.text())
    .catch((err) => {
      return JSON.stringify({ error: true, message: err.message });
    });

  const res = JSON.parse(textRes);
  token = res?.token;

  if (!token) {
    // not found in PII, check users table
    const c8Res = await c8ql(
      request,
      Fabrics.Global,
      Queries.SearchUserByEmail(),
      {
        email,
      },
      isApiKey
    ).then((response) => response.json());
    const c8User = c8Res?.result?.[0];
    const c8Token = c8User?.token as string;

    // this should be a non-encrypted user
    if (c8Token && isMMToken(c8Token)) {
      user = c8User;
      token = c8Token;
    }
  }
  return { token, user };
};

export default async (request: Request, email: string) => {
  let result: Array<UserData> = [];

  let { token, user } = await searchForEmail(request, email);
  if (token) {
    if (!user) {
      // this was from pii. Find user from the users table
      const c8Res = await c8ql(
        request,
        Fabrics.Global,
        Queries.SearchUserByToken(),
        { token }
      ).then((response) => response.json());
      user = c8Res?.result?.[0] as PiiData;
    }

    // find location details for this token
    const locationRes = await c8ql(
      request,
      Fabrics.Global,
      Queries.SearchLocationByToken(),
      { token }
    ).then((response) => response.json());
    const locationDetails = locationRes?.result?.[0] as LocationData;
    result = [
      {
        ...user,
        ...locationDetails,
      },
    ];
  } else {
    // did not find anything for this email
    console.log("--------NOT FOUND ANYWHERE----------");
  }
  console.log("--------FINAL----------");
  console.log(JSON.stringify(result));
  return result;
};
