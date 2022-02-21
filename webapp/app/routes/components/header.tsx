import { Link } from "remix";
import { AppPaths } from "~/constants";
import Menu from "./menu";

export default () => {
  return (
    <div className="navbar mb-2 shadow-lg bg-primary text-neutral-content box h-32">
      <div className="flex-1"></div>
      <div className="flex-1 justify-center">
        <div>
          <Link to={AppPaths.Logout} reloadDocument>
            <img
              src="macrometa-white-transparent.png"
              alt="Macrometa Image"
              className="object-scale-down h-20 w-96 mx-auto"
            />
            <div className="text-center">User Management Portal</div>
          </Link>
        </div>
      </div>
      <div className="flex-1 justify-end">
        <Menu />
      </div>
    </div>
  );
};
