import { useFetcher } from "remix";
import {
  ActionButtons,
  AppPaths,
  FormButtonActions,
  HttpMethods,
  MM_TOKEN_PREFIX,
} from "~/constants";
import { RowProps } from "~/interfaces";
import { isMMToken, truncate } from "~/utilities/utils";

export default ({
  activeRow,
  data,
  setActiveRow,
  isPrivateRegion,
  onActionButtonClicked,
}: RowProps) => {
  const {
    token,
    name,
    firstName,
    lastname,
    email,
    phone,
    State,
    Country,
    PostalCode,
    Title,
    isUploaded,
    Company,
    Status,
    LeadSource: Source,
    ConsentRequested,
  } = data;
  const isPrivate = isPrivateRegion === "true";
  const isPrivateRecord = !isMMToken(token);
  const fetcher = useFetcher();

  const isButtonDisabled = !isPrivate && isPrivateRecord;

  let showClass = "flex-1 btn-sm btn-ghost text-center leading-7 text-neutral";
  if (isPrivate) {
    showClass += isPrivateRecord ? "" : " invisible";
  } else {
    showClass += " hidden";
  }
  return (
    <tr
      className={activeRow === token ? "active" : ""}
      style={{ color: !isUploaded ? "#2463EB" : "black" }}
      onMouseEnter={() => {
        setActiveRow(token);
      }}
      onMouseLeave={() => {
        setActiveRow("");
      }}
    >
      <td>
        <span data-tip={token} className="tooltip tooltip-bottom">
          {truncate(token, 11)}
        </span>
      </td>
      <td>
        <span data-tip={firstName} className="tooltip tooltip-bottom">
          {truncate(firstName)}
        </span>
      </td>
      <td>
        <span data-tip={lastname} className="tooltip tooltip-bottom">
          {truncate(lastname)}
        </span>
      </td>
      <td>
        <span data-tip={email} className="tooltip tooltip-bottom">
          {truncate(email)}
        </span>
      </td>
      <td>
        <span data-tip={phone} className="tooltip tooltip-bottom">
          {truncate(phone)}
        </span>
      </td>
      <td>
        <span data-tip={Company} className="tooltip tooltip-bottom">
          {truncate(Company)}
        </span>
      </td>
      <td>
        <span data-tip={Status} className="tooltip tooltip-bottom">
          {truncate(Status)}
        </span>
      </td>
      <td>
        <span data-tip={Source} className="tooltip tooltip-bottom">
          {truncate(Source)}
        </span>
      </td>
      <td>
        <span data-tip={Country} className="tooltip tooltip-bottom">
          {truncate(Country)}
        </span>
      </td>
      <td>
        <fetcher.Form
          method={HttpMethods.Post}
          action={AppPaths.UserManagement}
        >
          <span
            data-tip={ConsentRequested ? "Requested" : "Not Requested"}
            className="tooltip tooltip-bottom m-auto"
          >
            <input
              type="checkbox"
              checked={ConsentRequested}
              className="form-control accent-green-600 ml-10 mt-1 h-5 w-5"
              onChange={(event) => {
                fetcher.submit(
                  {
                    [FormButtonActions.Name]: FormButtonActions.RequestConsent,
                    value: `${event.target.checked}`,
                    token: token,
                  },
                  { method: "post" }
                );
              }}
            />
          </span>
        </fetcher.Form>
      </td>
      <td className="flex">
        <div className="dropdown dropdown-left dropdown-end">
          <label tabIndex={0} className="m-1 btn">
            Click
          </label>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              {" "}
              <button
                className={`flex-1 btn btn-ghost btn-sm text-center leading-7 text-blue-600 mr-2 ${
                  isButtonDisabled ? "btn-disabled" : ""
                }`}
                disabled={isButtonDisabled}
                onClick={() => {
                  onActionButtonClicked(ActionButtons.Edit, data);
                }}
              >
                {ActionButtons.Edit}
              </button>
            </li>
            <li>
              <button
                className={`flex-1 btn btn-ghost btn-sm text-center leading-7 text-error mr-2 ${
                  isButtonDisabled ? "btn-disabled" : ""
                }`}
                disabled={isButtonDisabled}
                onClick={() => {
                  onActionButtonClicked(ActionButtons.Remove, data);
                }}
              >
                {ActionButtons.Remove}
              </button>
            </li>
           <li>
              <button
                className={`flex-1 btn btn-ghost btn-sm text-center leading-7 text-green-600 mr-2 text-neutral ${
                  isButtonDisabled ? "btn-disabled" : ""
                }`}
                disabled={isButtonDisabled}
                onClick={() => {
                  onActionButtonClicked(ActionButtons.Share, data);
                }}
              >
                {ActionButtons.Share}
              </button>
            </li>
            <li>
              <button
                className={showClass}
                disabled={isButtonDisabled}
                onClick={() => {
                  onActionButtonClicked(ActionButtons.Show, data);
                }}
              >
                {ActionButtons.Show}
              </button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
};
