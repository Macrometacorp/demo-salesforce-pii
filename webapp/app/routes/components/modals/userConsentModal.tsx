import { useEffect } from 'react';
import { useFetcher } from "remix";
import {
  AppPaths,
  FormButtonActions,
  HttpMethods,
  ModalPaths,
} from "~/constants";
import { ConsentModalProps, ModalProps } from "~/interfaces";
import { getModalId } from "~/utilities/utils";

export default ({ showModal, token, onModalClose }: ConsentModalProps) => {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "loading") {
      onModalClose();
    }
  }, [fetcher.state]);
  
  return (
    <div id={getModalId(ModalPaths.UserConsentModal)} className={`modal ${showModal ? "modal-open" : "modal-close"}`}>
      <div className="modal-box">
        <p>Are you sure you want to allow transfer of your data?</p>
          <input type="hidden" name="token" defaultValue={token} />
          <div className="modal-action">
            <button
              className="btn btn-info"
              name={FormButtonActions.Name}
              value={FormButtonActions.AllowConsent}
              onClick={() => {
                onModalClose();
              }}
            >
              Allow
            </button>
            <button
              className="btn btn-error"
              name={FormButtonActions.Name}
              value={FormButtonActions.RejectConsent}
              onClick={() => {
                onModalClose();
              }}
            >
              Don't Allow
            </button>
          </div>
      </div>
    </div>
  );
};
