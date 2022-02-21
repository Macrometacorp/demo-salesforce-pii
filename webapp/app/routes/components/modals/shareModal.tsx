import { ModalPaths, SHAREABLE_CURL_COMMAND_MESSAGE } from "~/constants";
import { getModalId } from "~/utilities/utils";
import { useEffect, useState } from "react";
import { ModalProps, UserData } from "~/interfaces";

export default ({ modalUserDetails, onModalClose }: ModalProps) => {
  const [decryptData, setDecryptData] = useState({} as UserData);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [shareableToken, setShareableToken] = useState("");
  const [copiedToClipboard, setcopiedToClipboard] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false)

  const decryptToken = async () => {
    try {
      const result = await fetch(`/decrypt?token=${modalUserDetails.token}`);
      const decryptResult = await result.text();
      const parsedDecryptedResult = JSON.parse(decryptResult);
      const { state, country, zipcode, job_title, token } = modalUserDetails;
      const { login, email, phone } = parsedDecryptedResult?.data;

      const decryptedData: UserData = {
        token,
        name: login,
        email,
        phone,
        state,
        country,
        zipcode,
        job_title,
      };
      setDecryptData(decryptedData);
    } catch (error) {
      alert("failed op");
      console.error(error);
    }
  };

  useEffect(() => {
    decryptToken();
  }, []);

  const getShareableToken = async () => {
    const result = await fetch(`/share?token=${modalUserDetails.token}`);
    const parsed: {
      record: string;
      message: string;
    } = await result.json();
    setShareableToken(parsed.record);
    setMessage(parsed.message);
  };

  useEffect(() => {
    getShareableToken();
  }, []);

  const sendMessage = async () => {
    if (decryptData && shareableToken) {
      setSendingMessage(true);
      setIsMessageSent(false);
      const result = await fetch(
        `/share?token=${shareableToken}&phoneNumber=${decryptData.phone}`
      );
      const sendMessageResult = await result.json();
      setSendingMessage(false);
      setIsMessageSent(true);
    }
  };
  const copyToClipboard = (text: string | null) => {
    let content = document.createElement("textarea");
    document.body.appendChild(content);
    content.value = text || "";
    content.select();
    document.execCommand("copy");
    document.body.removeChild(content);
    setcopiedToClipboard(true)
  };

  return (
    <div id={getModalId(ModalPaths.ShareModal)} className="modal modal-open">
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
              className={isMessageSent?"btn btn-success":"btn btn-primary"}
              onClick={() => {
                sendMessage();
              }}
            >
              {sendingMessage ? `Sending Message ...` :isMessageSent? 'Message Sent': "Send Message"}
            </button>
            <button
              className={!copiedToClipboard?"btn btn-neutral":"btn btn-success"}
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
