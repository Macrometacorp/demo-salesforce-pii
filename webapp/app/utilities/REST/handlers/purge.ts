import { Fabrics, Queries } from "~/constants";
import { c8ql } from "../mm";

export default async (request: Request) => {
  await c8ql(
    request,
    Fabrics.Eu,
    Queries.TruncateEuCollections(),
    undefined,
    true
  );
  console.log("EU fabric collections truncated successfully");
  await c8ql(
    request,
    Fabrics.Global,
    Queries.TruncateGlobalCollections(),
    undefined,
    true
  );
  console.log("Global fabric collections truncated successfully");
  //   TODO: truncate salesforce
  //   If any of the delete fails, application will be in a bad state. How to handle that?
  return { isPrivate: true, isDeleted: true };
};
