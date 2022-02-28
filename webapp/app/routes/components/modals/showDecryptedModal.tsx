import { useEffect, useState } from "react";
import { ModalPaths } from "~/constants";
import { ModalProps, UserData } from "~/interfaces";
import { getModalId } from "~/utilities/utils";

export default ({ modalUserDetails, onModalClose }: ModalProps) => {
  const [decryptData, setDecryptData] = useState({} as UserData);

  useEffect(() => {
    const { token } = modalUserDetails;
    fetch(`/decrypt?token=${modalUserDetails.token}`)
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
          firstName: login.toString().split(":")[0],
          lastname: login.toString().split(":")[1],
          email,
          phone,
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
    const { Country, token } = decryptData as UserData;
    content = (
      <>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={decryptData?.firstName}
            required
            disabled
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
            required
            disabled
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
            required
            disabled
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
            required
            disabled
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
            disabled
            defaultValue={decryptData?.Title}
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
            disabled
            defaultValue={decryptData?.NumberOfEmployees}
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
            disabled
            defaultValue={decryptData?.Website}
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
            disabled
            defaultValue={decryptData?.phone}
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
            required
            disabled
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
            required
            disabled
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
            required
            disabled
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
            required
            disabled
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
            disabled
            defaultValue={decryptData?.Street}
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
            disabled
            defaultValue={decryptData?.City}
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
            disabled
            defaultValue={decryptData?.State}
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
            required
            disabled
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
