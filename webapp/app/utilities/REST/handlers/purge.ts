import { Fabrics, Queries } from "~/constants";
import { c8ql } from "../mm";
import { bulkLeadRecordDelete } from "../salesforce";

export default async (request: Request): Promise<object> => {
  try {
    const bulkRecordDeleteResponse = await bulkLeadRecordDelete();
    const bulkRecordDeleteResult = await bulkRecordDeleteResponse.json();
     await c8ql(
      request,
      Fabrics.Eu,
      Queries.TruncateEuCollections(),
      {},
      true,
      "https://api-sturgeon-7f1d6466.paas.macrometa.io"
    );

    const truncateGlobalCollectionResponse = await c8ql(
      request,
      Fabrics.Global,
      Queries.TruncateGlobalCollections(),
      {},
      true
    );
      await truncateGlobalCollectionResponse.json();

    if (bulkRecordDeleteResult.message === "Data Purged") {
      return { isPurged: true };
    }
    return { isPurged: false };
  } catch (error: any) {
    return { error: true, errorMessage: error?.message, name: error?.name };
  }
};
