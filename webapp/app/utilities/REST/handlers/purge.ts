import { Fabrics, Queries } from "~/constants";
import { c8ql } from "../mm";
import { bulkLeadRecordDelete } from "../salesforce";

export default async (request: Request): Promise<object> => {
  try {
    const bulkRecordDeleteResponse = await bulkLeadRecordDelete();
    const bulkRecordDeleteResult = await bulkRecordDeleteResponse.json();
    const truncateEuCollectionResponse = await c8ql(
      request,
      Fabrics.Eu,
      Queries.TruncateEuCollections(),
      {},
      true,
      "https://api-gdn-eu-west.paas.macrometa.io"
    );
    const truncateEuCollectionResult =
      await truncateEuCollectionResponse.json();
    console.log(
      "EU fabric collections truncated successfully",
      truncateEuCollectionResult.code
    );

    const truncateGlobalCollectionResponse = await c8ql(
      request,
      Fabrics.Global,
      Queries.TruncateGlobalCollections(),
      {},
      true
    );
    const truncateGlobalCollectionResult =
      await truncateGlobalCollectionResponse.json();
    console.log(
      "Global fabric collections truncated successfully",
      truncateGlobalCollectionResult.result
    );

    if (bulkRecordDeleteResult.message === "Data Purged") {
      return { isPurged: true };
    }
    return { isPurged: false };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
