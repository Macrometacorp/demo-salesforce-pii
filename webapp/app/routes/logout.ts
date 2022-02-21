import type { LoaderFunction } from "remix";
import { logout } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  return logout(request);
};
