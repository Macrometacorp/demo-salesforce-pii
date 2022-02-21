import { useEffect, useState } from "react";
import { ModalPaths } from "~/constants";
import { ModalProps, UserData } from "~/interfaces";
import { getModalId } from "~/utilities/utils";

export default ({ modalUserDetails, onModalClose }: ModalProps) => {
  const [decryptData, setDecryptData] = useState({});

  useEffect(() => {
    fetch(`/decrypt?token=${modalUserDetails.token}`)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        const parsed = JSON.parse(response);
        const { state, country, zipcode, job_title, token } = modalUserDetails;
        const { login, email, phone } = parsed?.data;

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
      })
      .catch((error) => {
        alert("failed op");
        console.error(error);
      });
  }, []);

  let content = <div>Getting decrypted data...</div>;
  if (Object.keys(decryptData).length) {
    const { name, email, phone, state, country, zipcode, job_title } =
      decryptData as UserData;
    content = (
      <>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            disabled
            value={name}
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
            disabled
            value={email}
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
            disabled
            value={phone}
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
            disabled
            value={state}
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
            disabled
            value={zipcode}
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
            disabled
            value={job_title}
            className="input input-primary input-bordered"
          />
        </div>
      </>
    );
  }

  return (
    <div
      id={getModalId(ModalPaths.ShowDecryptedModal)}
      className="modal modal-open"
    >
      <div className="modal-box">
        {content}
        <div className="modal-action">
          <a onClick={onModalClose} className="btn">
            Close
          </a>
        </div>
      </div>
    </div>
  );
};
