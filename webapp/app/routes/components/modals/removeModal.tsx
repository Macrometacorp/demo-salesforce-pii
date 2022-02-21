import { Form } from "remix";
import {
  AppPaths,
  FormButtonActions,
  HttpMethods,
  ModalPaths,
} from "~/constants";
import { ModalProps } from "~/interfaces";
import { getModalId } from "~/utilities/utils";

export default ({ modalUserDetails, onModalClose }: ModalProps) => {
  const { token, country } = modalUserDetails;

  return (
    <div id={getModalId(ModalPaths.RemoveModal)} className="modal modal-open">
      <div className="modal-box">
        <p>Are you sure you want to delete? This operation is irreversible!</p>
        <Form
          action={AppPaths.UserManagement}
          method={HttpMethods.Post}
          reloadDocument
        >
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="country" value={country} />
          <div className="modal-action">
            <button
              className="btn btn-error"
              type="submit"
              name={FormButtonActions.Name}
              value={FormButtonActions.Delete}
            >
              Yes, I understand.
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => {
                onModalClose();
              }}
            >
              No, please take me back!
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};
