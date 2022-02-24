import { useEffect, useRef, useState } from "react";
import {
  ActionFunction,
  LoaderFunction,
  useCatch,
  useFetcher,
  useLoaderData,
} from "remix";
import Unauthorized from "./components/unauthorized";
import ErrorComponent from "./components/error";
import { UserData, UserManagementActionResult } from "~/interfaces";
import { getAuthTokens } from "~/sessions";
import {
  ResourceEndpoints,
  Fabrics,
  Queries,
  Session,
  HttpMethods,
  AppPaths,
  FormButtonActions,
} from "~/constants";
import { isLoggedIn, isMMToken } from "~/utilities/utils";
import { c8ql } from "~/utilities/REST/mm";
import ShareModal from "./components/modals/shareModal";
import CommonShareableModal from "./components/modals/commonShareableModal";
import { piiGetUserByToken } from "~/utilities/REST/pii";
import * as queryString from "query-string";
import handleUpdate from "../utilities/REST/handlers/update";

export const action: ActionFunction = async ({
  request,
}): Promise<UserManagementActionResult> => {
  const form = await request.formData();
  const actionType = form.get(FormButtonActions.Name)?.toString() ?? "";
  let result;
  switch (actionType) {
    case FormButtonActions.Update:
      result = await handleUpdate(request, form);
      break;
    default:
      result = {
        error: true,
        name: "Form action",
        errorMessage: "Unhandled form action",
      };
  }
  return {} as any;
  // return result;
};

export const loader: LoaderFunction = async ({ request }) => {
  let { [Session.PiiToken]: piiToken } = await getAuthTokens(request);
  const {
    query: { token },
  } = queryString.parseUrl(request.url);
  piiToken = piiToken ?? token ?? "";

  if (!token && !(await isLoggedIn(request))) {
    throw new Response("Unauthorized", { status: 401 });
  }
  
  const isPrivateRecord = !isMMToken(piiToken);
  const piiPromise = isPrivateRecord
    ? piiGetUserByToken(piiToken)
        .then((response) => {
          return response.text();
        })
        .catch((err) => {
          console.error(err.message);
          return { error: true, message: err.message };
        })
    : c8ql(
        request,
        Fabrics.Global,
        Queries.SearchUserByToken(),
        {
          token: piiToken,
        },
        true
      ).then((response) => response.json());

  const locationPromise = c8ql(
    request,
    Fabrics.Global,
    Queries.SearchLocationByToken(),
    { token: piiToken },
    true
  ).then((response) => response.json());

  const [piiResponse, locationResponse] = await Promise.all([
    piiPromise,
    locationPromise,
  ]);

  try {
    const parsedPiiResponse = isPrivateRecord
      ? JSON.parse(piiResponse)?.data
      : piiResponse?.result?.[0];
    const locationData =
      locationResponse?.result?.[0];
    const { login, email, phone, name } = parsedPiiResponse;
    const decryptedData: UserData = {
      ...locationData,
      ...parsedPiiResponse,
      name: isPrivateRecord ? login : name,
      email,
      phone,
      token: piiToken,
      isPrivateRecord,
    };
    return decryptedData;
  } catch (error: any) {
    console.error(error.message);
    console.error(error.name);
  }
  return {};
};

export default () => {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const formEl = useRef(null);
  const [showCommonModal, setShowCommonModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedEnpoint, setSharedEndpoint] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [decryptData, setDecryptData] = useState({} as UserData);

  const handleInput = (inputType: string) => {
    return (event: any) => {
      const { value } = event.target;
      setDecryptData({
        ...decryptData,
        [inputType]: value,
      });
    };
  };

  useEffect(() => {
    setDecryptData(loaderData)
  }, [loaderData]);
  
  return (
    <div className="card  shadow-lg max-w-lg mx-auto mt-10 hover:shadow-2xl">
      <div className="card-body">
        <fetcher.Form
          action={AppPaths.UserDetails}
          method={HttpMethods.Post}
          ref={formEl}
        >
          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              disabled={!isEdit}
              defaultValue={decryptData?.firstName}
              onChange={handleInput("firstName")}
              required
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              disabled={!isEdit}
              defaultValue={decryptData?.lastname}
              onChange={handleInput("lastname")}
              required
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Company</span>
            </label>
            <input
              type="text"
              name="company"
              disabled={!isEdit}
              defaultValue={decryptData?.company}
              onChange={handleInput("company")}
              required
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Lead Status</span>
            </label>
            <select
              className="select select-bordered"
              name="leadStatus"
              value={decryptData?.Status}
              onChange={handleInput("Status")}
              required
            >
              <option disabled selected>
                Lead Status
              </option>

              <option value={"Open - Not Contacted"}>
                Open - Not Contacted
              </option>
              <option value={"Working - Contacted"}>Working - Contacted</option>
              <option value={"Closed - Converted"}>Closed - Converted</option>
              <option value={"Closed - Not Converted"}>
                Closed - Not Converted
              </option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.title}
              onChange={handleInput("title")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Number Of Employees</span>
            </label>
            <input
              type="text"
              name="noOfEmployees"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.NumberOfEmployees}
              onChange={handleInput("NumberOfEmployees")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Website</span>
            </label>
            <input
              type="text"
              name="website"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.website}
              onChange={handleInput("website")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.phone}
              onChange={handleInput("phone")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Lead Source</span>
            </label>
            <select
              className="select select-bordered"
              name="leadSource"
              value={decryptData?.leadSource}
              onChange={handleInput("leadSource")}
              required
            >
              <option disabled aria-label="None" value="" selected>
                Lead Source
              </option>
              <option value={"Web"}>Web</option>
              <option value={"Phone Inquiry"}>Phone Inquiry</option>
              <option value={"Partner Referral"}>Partner Referral</option>
              <option value={"Purchased List"}>Purchased List</option>
              <option value={"Other"}>Other</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Industry</span>
            </label>
            <select
              className="select select-bordered"
              name="industry"
              value={decryptData?.industry}
              onChange={handleInput("industry")}
              required
            >
              <option disabled selected aria-label="None" value="">
                Industry
              </option>
              <option value={"Agriculture"}>Agriculture</option>
              <option value={"Apparel"}>Apparel</option>
              <option value={"Banking"}>Banking</option>
              <option value={"Biotechnology"}>Biotechnology</option>
              <option value={"Chemicals"}>Chemicals</option>
              <option value={"Communications"}>Communications</option>
              <option value={"Construction"}>Construction</option>
              <option value={"Consulting"}>Consulting</option>
              <option value={"Education"}>Education</option>
              <option value={"Electronics"}>Electronics</option>
              <option value={"Energy"}>Energy</option>
              <option value={"Engineering"}>Engineering</option>
              <option value={"Entertainment"}>Entertainment</option>
              <option value={"Environmental"}>Environmental</option>
              <option value={"Finance"}>Finance</option>
              <option value={"Food & Beverage"}>Food & Beverage</option>
              <option value={"Government"}>Government</option>
              <option value={"Healthcare"}>Healthcare</option>
              <option value={"Hospitality"}>Hospitality</option>
              <option value={"Insurance"}>Insurance</option>
              <option value={"Machinery"}>Machinery</option>
              <option value={"Manufacturing"}>Manufacturing</option>
              <option value={"Not For Profit"}>Not For Profit</option>
              <option value={"Recreation"}>Recreation</option>
              <option value={"Retail"}>Retail</option>
              <option value={"Shipping"}>Shipping</option>
              <option value={"Technology"}>Technology</option>
              <option value={"Telecommunications"}>Telecommunications</option>
              <option value={"Transportation"}>Transportation</option>
              <option value={"Utilities"}>Utilities</option>
              <option value={"Other"}>Other</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              disabled={!isEdit}
              defaultValue={decryptData?.email}
              onChange={handleInput("email")}
              required
              className="input input-primary input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Rating</span>
            </label>
            <select
              className="select select-bordered"
              name="rating"
              value={decryptData?.rating}
              onChange={handleInput("rating")}
              required
            >
              <option disabled selected aria-label="None" value="">
                Rating
              </option>
              <option value={"Hot"}>Hot</option>
              <option value={"Warm"}>Warm</option>
              <option value={"Cold"}>Cold</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Street</span>
            </label>
            <input
              type="text"
              name="street"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.street}
              onChange={handleInput("street")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              name="city"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.city}
              onChange={handleInput("city")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">State</span>
            </label>
            <input
              type="text"
              name="state"
              required
              disabled={!isEdit}
              defaultValue={decryptData?.state}
              onChange={handleInput("state")}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Country</span>
            </label>
            <input
              type="text"
              disabled
              defaultValue={decryptData?.country}
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Postal Code</span>
            </label>
            <input
              type="text"
              name="zipcode"
              disabled={!isEdit}
              defaultValue={decryptData?.postalCode}
              onChange={handleInput("postalCode")}
              required
              className="input input-primary input-bordered"
            />
          </div>

          <div className="justify-center card-actions">
            {isEdit ? (
              <button
                className="btn btn-outline btn-info"
                name={FormButtonActions.Name}
                value={FormButtonActions.Update}
                type="submit"
              >
                Update
              </button>
            ) : (
              <a
                className="btn btn-outline btn-neutral"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Edit
              </a>
            )}
            <a
              className="btn btn-outline btn-error"
              type="button"
              onClick={() => {
                setSharedEndpoint(ResourceEndpoints.Forget);
                setShowCommonModal(true);
              }}
            >
              Forget
            </a>
          </div>
        </fetcher.Form>
      </div>
      {showShareModal && (
        <ShareModal
          modalUserDetails={loaderData}
          onModalClose={() => {
            setShowShareModal(false);
          }}
        />
      )}
      {showCommonModal && (
        <CommonShareableModal
          endpoint={sharedEnpoint}
          onModalClose={() => {
            setShowCommonModal(false);
          }}
          piiToken={loaderData.token}
        />
      )}
    </div>
  );
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return <Unauthorized />;
  } else {
    return <ErrorComponent />;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <ErrorComponent />;
}
