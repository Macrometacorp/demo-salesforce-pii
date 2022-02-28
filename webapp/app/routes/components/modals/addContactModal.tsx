import { useEffect, useRef, useState } from "react";
import { useFetcher } from "remix";
import {
  AppPaths,
  FormButtonActions,
  HttpMethods,
  ModalPaths,
} from "~/constants";
import { getModalId } from "~/utilities/utils";

export default ({
  showModal,
  onModalClose,
}: {
  showModal: boolean;
  onModalClose: () => void;
}) => {
  const formEl = useRef(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "loading") {
      onModalClose();
    }
  }, [fetcher.state]);

  useEffect(() => {
    // reset form
    (formEl?.current as any)?.reset();
  }, [showModal]);

  return (
    <div
      id={getModalId(ModalPaths.AddContactModal)}
      className={`modal ${showModal ? "modal-open" : "modal-close"}`}
    >
      <div className="modal-box">
        <fetcher.Form
          ref={formEl}
          action={AppPaths.UserManagement}
          method={HttpMethods.Post}
        >
          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              placeholder="Bruce"
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
              required
              placeholder="Wayne"
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
              required
              placeholder="Macrometa"
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Lead Status</span>
            </label>
            <select className="select select-bordered" name="leadStatus">
              <option disabled selected>
                Lead Status
              </option>

              <option value={"Open - Not Contacted"}>
                Open - Not Contacted
              </option>
              <option value={"Working - Contacted"}>Working - Contacted</option>
              <option value={"Closed - Converted"}>Closed - Converted</option>
              <option value={"Closed - Not Converted"}>
                Closed - Not Converted
              </option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="272984356"
              className="input input-primary input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Mr"
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
              placeholder="100"
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
              placeholder="www.macrometa.dev"
              className="input input-primary input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Lead Source</span>
            </label>
            <select className="select select-bordered" name="leadSource">
              <option disabled aria-label="None" value="" selected></option>
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
            <select className="select select-bordered" name="industry">
              <option disabled selected aria-label="None" value="" />
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
              required
              placeholder="bruce@wayneindustries.com"
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              <span className="label-text">Rating</span>
            </label>
            <select className="select select-bordered" name="rating">
              <option disabled selected aria-label="None" value="" />
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
              placeholder="Wall Street"
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
              placeholder="New Jersey"
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
              placeholder="New Jersey"
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
              required
              placeholder="USA"
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
              placeholder="53540"
              className="input input-primary input-bordered"
            />
          </div>

          <div className="modal-action">
            <button
              className="btn btn-primary"
              name={FormButtonActions.Name}
              value={FormButtonActions.Create}
              type="submit"
            >
              Accept
            </button>
            <a onClick={onModalClose} className="btn">
              Close
            </a>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};
