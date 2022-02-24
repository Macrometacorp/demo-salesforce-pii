import { Link } from "remix";
import { AppPaths } from "~/constants";
import { HeaderProps } from "~/interfaces";
import LeftMenu from './leftMenu';
import Menu from "./menu";

export default (props: HeaderProps) => {
  return (
    <div className="navbar mb-2 shadow-lg bg-primary text-neutral-content box h-32">
      <div className="flex-1">
        <LeftMenu {...props}/>
      </div>
      <div className="flex-1 justify-center">
        <div>
          <Link to={AppPaths.Logout} reloadDocument>
            <img
              src="macrometa-white-transparent.png"
              alt="Macrometa Image"
              className="object-scale-down h-20 w-96 mx-auto"
            />
            <div className="text-center">Lead Management Portal</div>
          </Link>
        </div>
      </div>
      <div className="flex-1 justify-end">
        <Menu {...props} />
      </div>
    </div>
  );
};
