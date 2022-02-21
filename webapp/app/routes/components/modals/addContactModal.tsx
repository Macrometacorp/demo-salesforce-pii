import { Form } from "remix";
import {
  AppPaths,
  FormButtonActions,
  HttpMethods,
  ModalPaths,
} from "~/constants";
import { getModalId } from "~/utilities/utils";

export default () => (
  <div id={getModalId(ModalPaths.AddContactModal)} className="modal">
    <div className="modal-box">
      <Form
        action={AppPaths.UserManagement}
        method={HttpMethods.Post}
        reloadDocument
      >
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Bruce Wayne"
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
            required
            placeholder="bruce@wayneindustries.com"
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
            placeholder="272984356"
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
            <span className="label-text">Zipcode</span>
          </label>
          <input
            type="text"
            name="zipcode"
            required
            placeholder="53540"
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
            required
            placeholder="CEO"
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
          <a href={AppPaths.UserManagement} className="btn">
            Close
          </a>
        </div>
      </Form>
    </div>
  </div>
);
