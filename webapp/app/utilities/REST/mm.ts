import { Session } from "~/constants";
import { getAuthTokens } from "~/sessions";

export const mmLogin = (email: string, password: string) =>
  fetch(`${FEDERATION_URL}/_open/auth`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

export const getDatacenters = async (request: Request) => {
  const { [Session.Jwt]: token, [Session.Tenant]: tenant } =
    await getAuthTokens(request);

  return fetch(`${FEDERATION_URL}/datacenter/_tenant/${tenant}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
};

export const c8ql = async (
  request: Request,
  fabric: string,
  query: string,
  bindVars: Record<string, unknown> = {},
  isApiKey: boolean = false
) => {
  let authorization = "";
  if (isApiKey) {
    authorization = `apikey ${MM_API_KEY}`;
  } else {
    // use jwt
    const { [Session.Jwt]: token } = await getAuthTokens(request);
    authorization = `bearer ${token}`;
  }
  return fetch(`${FEDERATION_URL}/_fabric/${fabric}/_api/cursor`, {
    method: "POST",
    headers: {
      Authorization: authorization,
    },
    body: JSON.stringify({ query, bindVars }),
  });
};
