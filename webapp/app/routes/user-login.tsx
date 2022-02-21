import { ActionFunction, Form, useActionData } from "remix";
import { HttpMethods } from "~/constants";
import { userLogin } from "../sessions";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password") || "";

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  return await userLogin(request, email);
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="card shadow-lg max-w-lg mx-auto mt-20 hover:shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
        <Form method={HttpMethods.Post}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@macrometa.io"
              className="input input-primary input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              required
              className="input input-primary input-bordered"
            />
          </div>
          <button type="submit" className="btn btn-outline btn-primary mt-6">
            Submit
          </button>
        </Form>
      </div>
      {actionData && (
        <div className="alert alert-error">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 mx-2 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              ></path>
            </svg>
            <label>{actionData?.errorMessage}</label>
          </div>
        </div>
      )}
    </div>
  );
}
