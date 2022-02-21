import { parse as parseCSV } from "papaparse";
import { Form, Link, useSubmit } from "remix";
import {
  AppPaths,
  FormButtonActions,
  HttpMethods,
  ModalPaths,
  SessionStorage,
} from "~/constants";
import { useEffect, useState } from "react";
import ContactSVG from "../components/svgs/contact";
import UploadSVG from "../components/svgs/upload";

const FILE_SELECTOR_ID = "file-selector";

export default () => {
  const [showMenu, setShowMenu] = useState(false);
  const submit = useSubmit();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [showPartialMenu, setShowPartialMenu] = useState(false);

  useEffect(() => {
    const {
      location: { pathname },
    } = window;

    pathname === AppPaths.UserManagement || pathname === AppPaths.UserDetails
      ? setShowMenu(true)
      : setShowMenu(false);

    pathname === AppPaths.UserDetails
      ? setShowPartialMenu(true)
      : setShowPartialMenu(false);

    setRegion(sessionStorage.getItem(SessionStorage.Region) || "");
  });
  return (
    <div
      className={`h-32 flex-col justify-center ${showMenu ? "flex" : "hidden"}`}
    >
      {showPartialMenu ? (
        <div className="flex-none dropdown dropdown-end -mb-20">
          <button
            className="btn btn-square btn-ghost tooltip tooltip-left"
            data-tip="Account Options"
          >
            <img src="macrometa-icon.png" className="w-6 h-6 m-1" />
          </button>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-primary rounded-box w-52"
          >
            <Link to={AppPaths.Logout} reloadDocument>
              <li>
                <button className="btn btn-primary">Logout</button>
              </li>
            </Link>
          </ul>
        </div>
      ) : (
        <>
          <div className="pb-2">
            Region: <span className="badge ml-2">{region}</span>
          </div>
          <div className="-mb-4 flex flex-row">
            <Form
              action={
                search?.trim()
                  ? `${AppPaths.UserManagement}?email=${search}`
                  : AppPaths.UserManagement
              }
            >
              <div className="flex-1 lg:flex-none">
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Search by email"
                    className="input input-ghost"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                    }}
                  />
                </div>
              </div>
            </Form>
            <div className="flex-none">
              <button
                className="btn btn-square btn-ghost tooltip"
                data-tip="Add Contact"
                onClick={() => {
                  window.location.href = ModalPaths.AddContactModal;
                }}
              >
                <ContactSVG />
              </button>
            </div>

            <div className="flex-none">
              <Form
                action={AppPaths.UserManagement}
                method={HttpMethods.Post}
                onChange={(event) => {
                  submit(event.currentTarget, {
                    encType: "multipart/form-data",
                  });
                }}
              >
                <input
                  type="hidden"
                  name={FormButtonActions.Name}
                  value={FormButtonActions.Upload}
                ></input>
                <input
                  className="hidden"
                  type="file"
                  name="upload"
                  id={FILE_SELECTOR_ID}
                />
              </Form>
              <button
                className="btn btn-square btn-ghost tooltip"
                data-tip="Upload CSV"
                onClick={() => {
                  document.getElementById(FILE_SELECTOR_ID)?.click();
                }}
              >
                <UploadSVG />
              </button>
            </div>
            <div className="flex-none dropdown dropdown-end">
              <button
                className="btn btn-square btn-ghost tooltip tooltip-left"
                data-tip="Account Options"
              >
                <img src="macrometa-icon.png" className="w-6 h-6 m-1" />
              </button>
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-primary rounded-box w-52"
              >
                <Link to={AppPaths.Region}>
                  <li>
                    <button className="btn btn-primary">Change Region</button>
                  </li>
                </Link>
                <Link to={AppPaths.Logout} reloadDocument>
                  <li>
                    <button className="btn btn-primary">Logout</button>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
