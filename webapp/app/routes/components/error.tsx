import { Link } from "remix";
import { AppPaths } from "~/constants";

export default () => (
  <div className="hero">
    <div className="text-center hero-content">
      <div className="max-w-md">
        <p className="mb-5">
          {" "}
          Something unexpected went wrong. Sorry about that.
        </p>
        <Link to={AppPaths.Root}>
          <button className="btn btn-primary">Please Restart</button>
        </Link>
      </div>
    </div>
  </div>
);
