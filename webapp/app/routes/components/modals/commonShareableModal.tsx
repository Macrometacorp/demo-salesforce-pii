import {
  ModalPaths,
  Session,
  SHAREABLE_CURL_COMMAND_MESSAGE,
} from "~/constants";
import { getModalId } from "~/utilities/utils";
import { useEffect, useState } from "react";
import { CommonShareModalProps } from "~/interfaces";
export default ({
  endpoint,
  onModalClose,
  piiToken,
}: CommonShareModalProps) => {
  const [message, setMessage] = useState("");
  const [copiedToClipboard, setcopiedToClipboard] = useState(false);

  const getShareableCurlCommand = async () => {
      const result = await fetch(`${endpoint}?${Session.PiiToken}=${piiToken}`);
      const parsedResult = await result.json();
      const messageToBeSent = parsedResult.message; 
      setMessage(messageToBeSent);
  };

  useEffect(() => {
    getShareableCurlCommand();
  }, []);

  const copyToClipboard = (text: string | null) => {
    let content = document.createElement("textarea");
    document.body.appendChild(content);
    content.value = text || "";
    content.select();
    document.execCommand("copy");
    document.body.removeChild(content);
    setcopiedToClipboard(true);
  };

  return (
    <div
      id={getModalId(ModalPaths.ShowEditForgetModal)}
      className="modal modal-open"
    >
      {message ? (
        <div className="modal-box">
          <div
            className="card"
            style={{
              backgroundColor: "rgba(60,68,81,1)",
              borderColor: "grey",
              color: "rgb(0,0,0)",
            }}
          >
            <div className="card-body">
              <p
                style={{
                  fontFamily: "Menlo",
                  fontSize: "16px",
                  color: "rgba(255,255,255,1)",
                }}
              >
                {message}
              </p>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-neutral"
              disabled={copiedToClipboard}
              onClick={() => {
                copyToClipboard(message);
              }}
            >
              {!copiedToClipboard ? `Copy To Clipboard` : "Copied"}
            </button>
            <a onClick={onModalClose} className="btn">
              Close
            </a>
          </div>
        </div>
      ) : (
        <div className="modal-box">
          {SHAREABLE_CURL_COMMAND_MESSAGE}
          <div className="modal-action">
            <a onClick={onModalClose} className="btn">
              Close
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
