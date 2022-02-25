import { HeaderProps } from "~/interfaces";
import LatencySVG from "~/routes/components/svgs/latency";
import { AppPaths, FormButtonActions, HttpMethods } from "~/constants";
import { useEffect, useState } from "react";
import { useFetcher } from "remix";

export default ({ setShowLatencyModal }: HeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [refreshCache, setRefreshCache] = useState<Number>(0);
  const [refreshButtonClass, setRefreshButtonClass] = useState("");
  const fetcher = useFetcher();

  useEffect(() => {
    switch (fetcher.state) {
      case "submitting":
        setRefreshCache(1);
        setRefreshButtonClass("btn-warning");
        break;
      case "loading":
        setRefreshCache(2);
        setRefreshButtonClass("btn-success");
        break;
      default:
        setRefreshCache(0);
        setRefreshButtonClass("btn-neutral");
    }
  }, [fetcher.state]);

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
              className={`btn text-center ml-2 btn-sm mt-[9px] ${refreshButtonClass}`}
              data-tip="View Latency"
              name={FormButtonActions.Name}
              value={FormButtonActions.RefreshCache}
              type="submit"
            >
              {refreshCache == 0
                ? "Refresh Cache"
                : refreshCache == 1
                ? "Refreshing Cache ..."
                : "Cache Refreshed"}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
};
