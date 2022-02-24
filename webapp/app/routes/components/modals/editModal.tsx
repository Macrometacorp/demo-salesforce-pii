import { useEffect, useRef, useState } from "react";
import { useFetcher } from "remix";
import { FormButtonActions, HttpMethods, ModalPaths } from "~/constants";
import { EditModalProps, UserData } from "~/interfaces";
import { getModalId, isMMToken } from "~/utilities/utils";

export default ({
  showModal,
  modalUserDetails,
  onModalClose,
  formAction,
  shouldDecrypt = true,
}: EditModalProps) => {
  const fetcher = useFetcher();
  const formEl = useRef(null);

  const [decryptData, setDecryptData] = useState({} as UserData);

  const handleInput = (inputType: string) => {
    return (event: any) => {
      const { value } = event.target;
      setDecryptData({
        ...decryptData,
        [inputType]: value,
      });
    };
  };

  useEffect(() => {
    // reset form
    (formEl?.current as any)?.reset();
  }, [showModal]);

  useEffect(() => {
    if (fetcher.state === "loading") {
      onModalClose();
    }
  }, [fetcher.state]);

  useEffect(() => {
    const { token } = modalUserDetails;
    if (token) {
      const isPrivateRecord = !isMMToken(token);

      if (shouldDecrypt && isPrivateRecord) {
        fetch(`/decrypt?token=${token}`)
          .then((response) => {
            return response.text();
          })
          .then((response) => {
            const parsed = JSON.parse(response);

            const { login, email, phone } = parsed?.data;

            const decryptedData: UserData = {
              ...modalUserDetails,
              token,
              name: login,
              email,
              phone,
            };

            console.log(decryptedData);
            setDecryptData(decryptedData);
          })
          .catch((error) => {
            alert("failed op");
            console.error(error);
          });
      } else {
        setDecryptData(modalUserDetails);
      }
    }
  }, [modalUserDetails]);

  let content = <div>Getting decrypted data...</div>;
  if (Object.keys(decryptData).length) {
    const { Country, token } = decryptData as UserData;
    content = (
      <fetcher.Form action={formAction} method={HttpMethods.Post} ref={formEl}>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={decryptData?.firstName}
            onChange={handleInput("firstName")}
            required
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            name="lastName"
            defaultValue={decryptData?.lastname}
            onChange={handleInput("lastname")}
            required
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Company</span>
          </label>
          <input
            type="text"
            name="company"
            defaultValue={decryptData?.Company}
            onChange={handleInput("company")}
            required
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Lead Status</span>
          </label>
          <select
            className="select select-bordered"
            name="leadStatus"
            value={decryptData?.LeadStatus}
            onChange={handleInput("Status")}
            required
          >
            <option disabled selected>
              Lead Status
            </option>

            <option value={"Open - Not Contacted"}>Open - Not Contacted</option>
            <option value={"Working - Contacted"}>Working - Contacted</option>
            <option value={"Closed - Converted"}>Closed - Converted</option>
            <option value={"Closed - Not Converted"}>
              Closed - Not Converted
            </option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={decryptData?.Title}
            onChange={handleInput("title")}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Number Of Employees</span>
          </label>
          <input
            type="text"
            name="noOfEmployees"
            required
            defaultValue={decryptData?.NumberOfEmployees}
            onChange={handleInput("NumberOfEmployees")}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Website</span>
          </label>
          <input
            type="text"
            name="website"
            required
            defaultValue={decryptData?.Website}
            onChange={handleInput("website")}
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
            required
            defaultValue={decryptData?.phone}
            onChange={handleInput("phone")}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Lead Source</span>
          </label>
          <select
            className="select select-bordered"
            name="leadSource"
            value={decryptData?.LeadSource}
            onChange={handleInput("leadSource")}
            required
          >
            <option disabled aria-label="None" value="" selected>
              Lead Source
            </option>
            <option value={"Web"}>Web</option>
            <option value={"Phone Inquiry"}>Phone Inquiry</option>
            <option value={"Partner Referral"}>Partner Referral</option>
            <option value={"Purchased List"}>Purchased List</option>
            <option value={"Other"}>Other</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Industry</span>
          </label>
          <select
            className="select select-bordered"
            name="industry"
            value={decryptData?.Industry}
            onChange={handleInput("industry")}
            required
          >
            <option disabled selected aria-label="None" value="">
              Industry
            </option>
            <option value={"Agriculture"}>Agriculture</option>
            <option value={"Apparel"}>Apparel</option>
            <option value={"Banking"}>Banking</option>
            <option value={"Biotechnology"}>Biotechnology</option>
            <option value={"Chemicals"}>Chemicals</option>
            <option value={"Communications"}>Communications</option>
            <option value={"Construction"}>Construction</option>
            <option value={"Consulting"}>Consulting</option>
            <option value={"Education"}>Education</option>
            <option value={"Electronics"}>Electronics</option>
            <option value={"Energy"}>Energy</option>
            <option value={"Engineering"}>Engineering</option>
            <option value={"Entertainment"}>Entertainment</option>
            <option value={"Environmental"}>Environmental</option>
            <option value={"Finance"}>Finance</option>
            <option value={"Food & Beverage"}>Food & Beverage</option>
            <option value={"Government"}>Government</option>
            <option value={"Healthcare"}>Healthcare</option>
            <option value={"Hospitality"}>Hospitality</option>
            <option value={"Insurance"}>Insurance</option>
            <option value={"Machinery"}>Machinery</option>
            <option value={"Manufacturing"}>Manufacturing</option>
            <option value={"Not For Profit"}>Not For Profit</option>
            <option value={"Recreation"}>Recreation</option>
            <option value={"Retail"}>Retail</option>
            <option value={"Shipping"}>Shipping</option>
            <option value={"Technology"}>Technology</option>
            <option value={"Telecommunications"}>Telecommunications</option>
            <option value={"Transportation"}>Transportation</option>
            <option value={"Utilities"}>Utilities</option>
            <option value={"Other"}>Other</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            defaultValue={decryptData?.email}
            onChange={handleInput("email")}
            required
            className="input input-primary input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Rating</span>
          </label>
          <select
            className="select select-bordered"
            name="rating"
            value={decryptData?.Rating}
            onChange={handleInput("rating")}
            required
          >
            <option disabled selected aria-label="None" value="">
              Rating
            </option>
            <option value={"Hot"}>Hot</option>
            <option value={"Warm"}>Warm</option>
            <option value={"Cold"}>Cold</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Street</span>
          </label>
          <input
            type="text"
            name="street"
            required
            defaultValue={decryptData?.Street}
            onChange={handleInput("street")}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">City</span>
          </label>
          <input
            type="text"
            name="city"
            required
            defaultValue={decryptData?.City}
            onChange={handleInput("city")}
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
            required
            defaultValue={decryptData?.State}
            onChange={handleInput("state")}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Country</span>
          </label>
          <input
            type="text"
            disabled
            defaultValue={Country}
            className="input input-primary input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Postal Code</span>
          </label>
          <input
            type="text"
            name="zipcode"
            defaultValue={decryptData?.PostalCode}
            onChange={handleInput("postalCode")}
            required
            className="input input-primary input-bordered"
          />
        </div>

        <input
          type="text"
          name="token"
          defaultValue={token}
          className="hidden"
        />
        <input
          type="text"
          name="country"
          defaultValue={Country}
          className="hidden"
        />

        <div className="modal-action">
          <button
            className="btn btn-primary"
            type="submit"
            name={FormButtonActions.Name}
            value={FormButtonActions.Update}
          >
            Update
          </button>
          <a onClick={onModalClose} className="btn">
            Close
          </a>
        </div>
      </fetcher.Form>
    );
  }

  return (
    <div
      id={getModalId(ModalPaths.EditModal)}
      className={`modal ${showModal ? "modal-open" : "modal-close"}`}
    >
      <div className="modal-box">
        {content}
        {/* use <Form> button instead when data is there */}
        {!Object.keys(decryptData).length && (
          <div className="modal-action">
            <a onClick={onModalClose} className="btn">
              Close
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
