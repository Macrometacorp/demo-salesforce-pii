import { UserConsent } from './../../../interfaces';
import { Fabrics, Queries } from "~/constants";
import { LocationData, UserData } from "~/interfaces";
import { c8ql } from "../mm";

export default async (request: Request) => {
  const getUsersPromise = c8ql(
    request,
    Fabrics.Global,
    Queries.GetUsers()
  ).then((response) => response.json());
  const getUserLeadInfoPromise = c8ql(
    request,
    Fabrics.Global,
    Queries.GetUserLeadInfo()
  ).then((response) => response.json());
  const getUserConsentPromise = c8ql(
    request,
    Fabrics.Global,
    Queries.GetUserConsents()
  ).then((response) => response.json());

  const allResponses = await Promise.all([
    getUsersPromise,
    getUserLeadInfoPromise,
    getUserConsentPromise
  ]);

  const users: Array<UserData> = allResponses?.[0]?.result ?? [];
  const userLeadInfo: Array<LocationData> = allResponses?.[1]?.result ?? [];
  const consents: Array<UserConsent> = allResponses?.[2]?.result ?? [];
  const result = users?.map((user) => {
    const { token } = user;

    const filteredUserLeadInfo = userLeadInfo.find((element) => {
      return element.value[0].token === token});

    const consent = consents.find((consent) => {
      return consent._key === token});

    return {
      ...user,
      ...filteredUserLeadInfo?.value[0],
      _key: filteredUserLeadInfo?._key,
      ConsentRequested: consent?.ConsentRequested
    };
  });
  return result;
};
