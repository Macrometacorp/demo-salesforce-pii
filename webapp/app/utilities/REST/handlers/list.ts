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

  const users: Array<UserData> = allResponses?.[0]?.result ?? [];
  const locations: Array<LocationData> = allResponses?.[1]?.result ?? [];

  const result = users?.map((user) => {
    const { token } = user;
    const location = locations.find((location) => location.token === token);
    return {
      ...user,
      ...location,
    };
  });
  return result;
};
