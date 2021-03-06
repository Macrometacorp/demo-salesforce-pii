import type { LoaderFunction } from "remix";
import * as queryString from "query-string";
import { sendMessage } from "../utilities/REST/twilio";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    query: { token, phoneNumber = "" },
  } = queryString.parseUrl(request.url);
  const url = new URL(request.url);
  const { host, protocol } = url;
  if (!phoneNumber) {
    const message = `${protocol}//${host}/user-details?token=${token?.toString()}`;
    return {
      message,
      record: token,
    };
  } else {
    const message = `${protocol}//${host}/user-details?token=${token}`;
    const RECIPIENT = `+${phoneNumber?.toString()}`;
    let encoded = new URLSearchParams();
    encoded.append("To", RECIPIENT);
    encoded.append("From", TWILIO_NUMBER);
    encoded.append("Body", message);
    try {
      let result = await sendMessage(encoded);
      result = await result.json();
      return {
        ...result,
        isSend: true,
      };
    } catch (error: any) {
      return {
        sendError: true,
        errorMessage: error?.message,
        name: error?.name,
      };
    }
  }
};
