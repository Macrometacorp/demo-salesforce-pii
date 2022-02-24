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

  const allResponses = await Promise.all([
    getUsersPromise,
    getLocationsPromise,
  ]);
// console.log("allResponses",allResponses)
  const users: Array<UserData> = allResponses?.[0]?.result ?? [];
  const locations: Array<LocationData> = allResponses?.[1]?.result ?? [];
  // console.log("locations",locations)
  const result = users?.map((user) => {
    const { token } = user;
    // console.log("token",token)
    const location = locations.find((location) => {
      // console.log("------location",location.value[0])
      return location.value[0].token === token});
    return {
      ...user,
      ...location?.value[0],
      _key: location?._key,
    };
  });
  return result;
};
