import { useRef, useState } from "react";
import { ActionFunction, LoaderFunction, useCatch, useFetcher, useLoaderData } from "remix";
import Unauthorized from "./components/unauthorized";
import ErrorComponent from "./components/error";
import { UserData, UserManagementActionResult } from "~/interfaces";
import { getAuthTokens } from "~/sessions";
import { ResourceEndpoints, Fabrics, Queries, Session, HttpMethods, AppPaths, FormButtonActions } from "~/constants";
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
  const actionType =
    form.get(FormButtonActions.Name)?.toString() ?? "";
    console.log(form)
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

  return result;
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
    const { state, country, zipcode, job_title } =
      locationResponse?.result?.[0];
    const { login, email, phone, name } = parsedPiiResponse;
    const decryptedData = {
      name: isPrivateRecord ? login : name,
      email,
      phone,
      state,
      country,
      zipcode,
      job_title,
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
  const { name, email, phone, state, country, zipcode, job_title } =
    loaderData as UserData;

  return (
    <div className="card  shadow-lg max-w-lg mx-auto mt-10 hover:shadow-2xl">
      <div className="card-body">
      <fetcher.Form action={AppPaths.UserDetails} method={HttpMethods.Post} ref={formEl}>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            disabled={!isEdit}
            required
            defaultValue={name}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            disabled={!isEdit}
            required
            defaultValue={email}
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
            disabled={!isEdit}
            required
            defaultValue={phone}
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
            disabled={!isEdit}
            required
            defaultValue={state}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Country</span>
          </label>
          <input
            type="text"
            name="country"
            disabled
            value={country}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Zipcode</span>
          </label>
          <input
            type="text"
            name="zipcode"
            disabled={!isEdit}
            required
            defaultValue={zipcode}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Job Title</span>
          </label>
          <input
            type="text"
            name="job_title"
            disabled={!isEdit}
            required
            defaultValue={job_title}
            className="input input-primary input-bordered"
          />
        </div>
        <div className="justify-center card-actions">
          {isEdit ? (<button
            className="btn btn-outline btn-info"
            name={FormButtonActions.Name}
            value={FormButtonActions.Update}
            type='submit'
          >
            Update
          </button>) :(<a
            className="btn btn-outline btn-neutral"
            onClick={() => {
              setIsEdit(true)
            }}
          >
            Edit
          </a>)}
          <a
            className="btn btn-outline btn-error"
            type='button'
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
