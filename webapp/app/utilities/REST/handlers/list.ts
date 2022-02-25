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
  const getLocationsPromise = c8ql(
    request,
    Fabrics.Global,
    Queries.GetLocations()
  ).then((response) => response.json());
  const getUserConsentPromise = c8ql(
    request,
    Fabrics.Global,
    Queries.GetUserConsents()
  ).then((response) => response.json());

  const allResponses = await Promise.all([
    getUsersPromise,
    getLocationsPromise,
    getUserConsentPromise
  ]);

  const users: Array<UserData> = allResponses?.[0]?.result ?? [];
  const locations: Array<LocationData> = allResponses?.[1]?.result ?? [];
  const consents: Array<UserConsent> = allResponses?.[2]?.result ?? [];

  const result = users?.map((user) => {
    const { token } = user;
    

    const location = locations.find((location) => {
      return location.value[0].token === token});
    const consent = consents.find((consent) => {
      return consent._key === token});
    return {
      ...user,
      ...location?.value[0],
      _key: location?._key,
      ConsentApproved: consent?.ConsentApproved
    };
  });
  return result;
};
