import { getAuthTokens } from "~/sessions";
import {
  MM_TOKEN_PREFIX,
  ModalPaths,
  Session,
  TRUNCATE_LENGTH,
} from "../constants";
import { DataCenter } from "../interfaces";
import EuroCountries from "./euro-countries";

export const getModalId = (path: ModalPaths) => path.substring(1);

export const isEu = (region: string): boolean => region.includes("-eu-");

export const getRegionLabel = (dc: DataCenter): string => {
  const {
    locationInfo: { city, countrycode },
  } = dc;
  const label = `${city}, ${countrycode}`;
  return label;
};

export const isPrivateRegion = (country: string): boolean => {
  const found = EuroCountries.find(
    (countryDetail) =>
      countryDetail.name.toUpperCase() === country.toUpperCase() ||
      countryDetail.code.toUpperCase() === country.toUpperCase()
  );
  return !!found;
};

export const isLoggedIn = async (request: Request): Promise<boolean> => {
  const { [Session.Jwt]: token, [Session.PiiToken]: piiToken } =
    await getAuthTokens(request);
  return !!token || !!piiToken;
};

export const truncate = (text: string,truncateLength=TRUNCATE_LENGTH) => {
  if (text?.length > truncateLength) {
    text = `${text.substring(0, truncateLength)}...`;
  }
  return text;
};

export const isMMToken = (token: string) =>
  token.substring(0, MM_TOKEN_PREFIX.length) === MM_TOKEN_PREFIX;
