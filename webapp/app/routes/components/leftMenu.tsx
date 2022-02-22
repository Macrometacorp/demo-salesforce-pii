import { HeaderProps } from "~/interfaces";
import LatencySVG from "~/routes/components/svgs/contact";
import { AppPaths, FormButtonActions, HttpMethods } from "~/constants";
import { useEffect, useState } from "react";
import { useFetcher } from "remix";

export default ({ setShowLatencyModal }: HeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    const {
      location: { pathname },
    } = window;

    pathname === AppPaths.UserManagement
      ? setShowMenu(true)
      : setShowMenu(false);
  });

  return (
    <div
      className={`h-32 flex-col justify-center ${showMenu ? "flex" : "hidden"}`}
    >
      <div className="flex flex-row mt-[49px]">
        <div className="flex-none">
          <button
            className="btn btn-square btn-ghost tooltip tooltip-right"
            data-tip="View Latency"
            onClick={() => {
              setShowLatencyModal(true);
            }}
          >
            <LatencySVG />
          </button>
        </div>
        <div className="flex-none">
          <fetcher.Form
            method={HttpMethods.Post}
            action={AppPaths.UserManagement}
          >
            <button
              className="btn text-center ml-2 btn-sm mt-[9px]"
              data-tip="View Latency"
              name={FormButtonActions.RefreshCache}
              value={FormButtonActions.RefreshCache}
              type="submit"
            >
              Refresh Cache
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
};
