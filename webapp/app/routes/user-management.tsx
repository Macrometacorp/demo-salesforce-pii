import { useEffect, useState } from "react";
import {
  ActionFunction,
  LoaderFunction,
  useActionData,
  useCatch,
  useFetchers,
  useLoaderData,
  useOutletContext,
  useTransition,
} from "remix";
import * as queryString from "query-string";

import {
  CONTACTS_PER_PAGE,
  ActionButtons,
  HEADINGS,
  SessionStorage,
  ToastTypes,
  FormButtonActions,
  AppPaths,
} from "~/constants";

import { Context, UserData, UserManagementActionResult } from "~/interfaces";
import { isLoggedIn } from "~/utilities/utils";

import EditModal from "./components/modals/editModal";
import RemoveModal from "./components/modals/removeModal";
import ShareModal from "./components/modals/shareModal";
import AddContactModal from "./components/modals/addContactModal";
import ProgressModal from "./components/modals/progressModal";
import Row from "./components/tableRow";
import Unauthorized from "./components/unauthorized";
import ErrorComponent from "./components/error";
import DecryptedModal from "./components/modals/showDecryptedModal";
import { Pagination } from "./components/Pagination";
import Toast from "./components/toast";

import handleCreate from "../utilities/REST/handlers/create";
import handleUpdate from "../utilities/REST/handlers/update";
import handleDelete from "../utilities/REST/handlers/delete";
import handleUpload from "../utilities/REST/handlers/upload";
import handleList from "../utilities/REST/handlers/list";
import handleSearch from "../utilities/REST/handlers/search";

export const action: ActionFunction = async ({
  request,
}): Promise<UserManagementActionResult> => {
  const form = await request.formData();
  const actionType = form.get(FormButtonActions.Name)?.toString() ?? "";

  let result;
  switch (actionType) {
    case FormButtonActions.Create:
      result = await handleCreate(request, form);
      break;
    case FormButtonActions.Update:
      result = await handleUpdate(request, form);
      break;
    case FormButtonActions.Delete:
      result = await handleDelete(request, form);
      break;
    case FormButtonActions.Upload:
      result = await handleUpload(request, form);
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
  if (!(await isLoggedIn(request))) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const {
    query: { email },
  } = queryString.parseUrl(request.url);

  let result;
  if (email) {
    result = await handleSearch(request, email.toString());
  } else {
    result = await handleList(request);
  }
  return result;
};

export default () => {
  const {
    addContactModal: { showAddContactModal, setShowAddContactModal },
  } = useOutletContext<Context>();

  const fetchers = useFetchers();
  const action = useActionData();

  const allUserData = useLoaderData();
  const transition = useTransition();

  const actionData = fetchers?.[0]?.data || action;

  const userData = allUserData.filter((user: UserData) => !!user?.name?.trim());
  const [activeRow, setActiveRow] = useState("");
  const [isPrivateRegion, setIsPrivateRegion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastContact = currentPage * CONTACTS_PER_PAGE;
  const indexOfFirstContact = indexOfLastContact - CONTACTS_PER_PAGE;
  const currentContacts = userData.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [modalUserDetails, setModalUserDetails] = useState({} as UserData);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(ToastTypes.Info);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // to reset page when using search
    if (userData.length < CONTACTS_PER_PAGE) {
      setCurrentPage(1);
    }
  }, [userData.length]);

  useEffect(() => {
    setTimeout(() => {
      setShowToast(false);
      setToastType(ToastTypes.Info);
      setToastMessage("");
    }, 2000);
  }, [showToast]);

  useEffect(() => {
    if (actionData) {
      const { error, isPrivate, isDeleted, isUpdated, isAdded } = actionData;

      let toastType = error
        ? ToastTypes.Error
        : isPrivate
        ? ToastTypes.Info
        : ToastTypes.Success;

      let toastMessage = "";
      if (error) {
        toastMessage = `${error.name}: ${error.errorMessage}`;
      } else {
        if (isAdded) {
          toastMessage = "Your new record will reflect shortly";
        } else if (isUpdated) {
          toastMessage = "Your record is updated and will reflect shortly";
        } else if (isDeleted) {
          toastMessage = "Your record is deleted and will reflect shortly";
        }
      }

      setShowToast(true);
      setToastType(toastType);
      setToastMessage(toastMessage);
    }
  }, [actionData]);

  useEffect(() => {
    setIsPrivateRegion(
      sessionStorage.getItem(SessionStorage.IsPrivateRegion) || ""
    );
  }, []);

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            {HEADINGS.map((heading) => {
              const textStyle = heading === "actions" ? "text-center" : "";
              return (
                <th className={textStyle} key={heading}>
                  {heading}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {currentContacts.length > 0 &&
            currentContacts.map((data: UserData) => (
              <Row
                key={data.token}
                activeRow={activeRow}
                setActiveRow={setActiveRow}
                data={data}
                isPrivateRegion={isPrivateRegion}
                onActionButtonClicked={(
                  action: ActionButtons,
                  details: UserData
                ) => {
                  setModalUserDetails(details);
                  switch (action) {
                    case ActionButtons.Show:
                      setShowDecryptModal(true);
                      break;
                    case ActionButtons.Edit:
                      setShowEditModal(true);
                      break;
                    case ActionButtons.Remove:
                      setShowRemoveModal(true);
                      break;
                    case ActionButtons.Share:
                      setShowShareModal(true);
                      break;
                  }
                }}
              />
            ))}
        </tbody>
      </table>
      {currentContacts.length == 0 && (
        <div className="flex justify-center">
          <p className="mb-5 text-3xl font-bold">No contacts found</p>
        </div>
      )}
      <EditModal
        showModal={showEditModal}
        modalUserDetails={modalUserDetails}
        formAction={AppPaths.UserManagement}
        onModalClose={() => {
          setShowEditModal(false);
        }}
      />

      {showRemoveModal && (
        <RemoveModal
          modalUserDetails={modalUserDetails}
          onModalClose={() => {
            setShowRemoveModal(false);
          }}
        />
      )}

      {showShareModal && (
        <ShareModal
          modalUserDetails={modalUserDetails}
          onModalClose={() => {
            setShowShareModal(false);
          }}
        />
      )}
      <AddContactModal
        showModal={showAddContactModal}
        onModalClose={() => {
          setShowAddContactModal(false);
        }}
      />
      {showDecryptModal && (
        <DecryptedModal
          modalUserDetails={modalUserDetails}
          onModalClose={() => {
            setShowDecryptModal(false);
          }}
        />
      )}

      {transition.state !== "submitting" &&
        transition.state !== "loading" &&
        currentContacts.length > 0 && (
          <Pagination
            contactsPerPage={CONTACTS_PER_PAGE}
            totalContacts={userData.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        )}
      {transition.state === "submitting" && <ProgressModal />}

      {actionData && (
        <Toast
          toastType={toastType}
          message={toastMessage}
          showToast={showToast}
          closeToast={closeToast}
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
