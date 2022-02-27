import { HeaderProps } from "~/interfaces";
import { AppPaths, FormButtonActions, HttpMethods } from "~/constants";
import { useEffect, useState } from "react";
import { useFetcher } from "remix";
import SalesForceSVG from "~/routes/components/svgs/salesforce";
import RefreshSVG from "~/routes/components/svgs/refresh";
import RefreshCacheSVG from "~/routes/components/svgs/refreshCache";
import ProgressModal from './modals/progressModal';

export default ({ setShowLatencyModal }: HeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
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
        <fetcher.Form
          method={HttpMethods.Post}
          action={AppPaths.UserManagement}
          reloadDocument
        >
          <button
            className={`btn btn-square btn-ghost tooltip`}
            data-tip="Refresh Page"
            name={FormButtonActions.Name}
            value={FormButtonActions.RefreshPage}
            type="submit"
          >
            <RefreshSVG />
          </button>
        </fetcher.Form>
      </div>
        <div className="flex-none">
          <fetcher.Form
            method={HttpMethods.Post}
            action={AppPaths.UserManagement}
          >
            <button
              className="btn btn-square btn-ghost tooltip"
              data-tip="Refresh Cache"
              name={FormButtonActions.Name}
              value={FormButtonActions.RefreshCache}
              type="submit"
            >
              <RefreshCacheSVG />
            </button>
          </fetcher.Form>
        </div>
        <div className="flex-none pl-1">
              <fetcher.Form
                method={HttpMethods.Post}
                action={AppPaths.UserManagement}
              >
                <button
                  className={`btn btn-square btn-ghost tooltip`}
                  data-tip="Bulk Upload To Salesforce"
                  name={FormButtonActions.Name}
                  value={FormButtonActions.BulkUpload}
                  type="submit"
                >
                  <SalesForceSVG />
                </button>
              </fetcher.Form>
            </div>
      </div>
      {fetcher.state === "submitting" && <ProgressModal />}
    </div>
  );
};
