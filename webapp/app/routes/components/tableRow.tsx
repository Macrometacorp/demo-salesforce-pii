import { ActionButtons, MM_TOKEN_PREFIX } from "~/constants";
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
  } = data;
  const isPrivate = isPrivateRegion === "true";
  const isPrivateRecord = !isMMToken(token);

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
      style={{ color: !isUploaded ? "green" : "black" }}
      onMouseEnter={() => {
        setActiveRow(token);
      }}
      onMouseLeave={() => {
        setActiveRow("");
      }}
    >
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
        <span data-tip={State} className="tooltip tooltip-bottom">
          {truncate(State)}
        </span>
      </td>
      <td>
        <span data-tip={Country} className="tooltip tooltip-bottom">
          {truncate(Country)}
        </span>
      </td>
      <td>
        <span data-tip={PostalCode} className="tooltip tooltip-bottom">
          {truncate(PostalCode)}
        </span>
      </td>
      <td>
        <span data-tip={Title} className="tooltip tooltip-bottom">
          {truncate(Title, 12)}
        </span>
      </td>
      <td className="flex">
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
        <button
          className={`flex-1 btn btn-ghost btn-sm text-center leading-7 text-green-600 mr-2 ${
            isButtonDisabled ? "btn-disabled" : ""
          }${showClass}`}
          disabled={isButtonDisabled}
          onClick={() => {
            onActionButtonClicked(ActionButtons.Share, data);
          }}
        >
          {ActionButtons.Share}
        </button>
        <button
          className={showClass}
          disabled={isButtonDisabled}
          onClick={() => {
            onActionButtonClicked(ActionButtons.Show, data);
          }}
        >
          {ActionButtons.Show}
        </button>
      </td>
    </tr>
  );
};
