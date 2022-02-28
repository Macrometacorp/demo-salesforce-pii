import { Fabrics, Queries } from "~/constants";
import { c8ql } from "../mm";
import { bulkLeadRecordDelete } from "../salesforce";

export default async (request: Request) => {
  try{
//  const res= await c8ql(
//     request,
//     Fabrics.Eu,
//     Queries.TruncateEuCollections(),
//     {},
//     true,
//     "https://api-gdn-eu-west.paas.macrometa.io"
//   );
//   console.log("EU fabric collections truncated successfully",res);
//   const r = await res.json()

// const rses=  await c8ql(
//     request,
//     Fabrics.Global,
//     Queries.TruncateGlobalCollections(),
//     {},
//     true
//   );
//   const rs= await rses.json()
//   console.log("EU fabric collections truncated successfully",r);

  const as = await bulkLeadRecordDelete();
  console.log("as",as)
 }
 catch(error){
   console.log("Err",error)
 }

  console.log("Global fabric collections truncated successfully");
  //   TODO: truncate salesforce
  //   If any of the delete fails, application will be in a bad state. How to handle that?
  return { isPrivate: true, isDeleted: true };
};
