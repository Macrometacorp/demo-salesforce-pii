import { Link } from "remix";
import { AppPaths } from "~/constants";

export default () => (
  <div className="hero">
    <div className="text-center hero-content">
      <div className="max-w-md">
        <p className="mb-5 text-3xl font-bold">Hello there</p>
        <p className="mb-5">You must be logged in first!</p>
        <Link to={AppPaths.Root}>
          <button className="btn btn-primary">Login</button>
        </Link>
      </div>
    </div>
  </div>
);
