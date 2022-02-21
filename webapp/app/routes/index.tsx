import { Link } from "remix";
import { AppPaths } from "~/constants";

export default function Index() {
  return (
    <div className="hero">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <div className="avatar">
            <div className="mt-8 rounded-full w-14 h-14">
              <img src="macrometa-icon.png" alt="macrometa" />
            </div>
          </div>
          <p className="mb-5">Built with love by Macrometa</p>
          <Link to={AppPaths.Login}>
            <button className="btn btn-primary mr-5">Admin Login</button>
          </Link>
          <Link to={AppPaths.UserLogin}>
            <button className="btn btn-primary">User Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
