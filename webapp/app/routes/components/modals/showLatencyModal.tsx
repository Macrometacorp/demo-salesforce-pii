import { getModalId, isLoggedIn, truncate } from "~/utilities/utils";
import { LATENCY_HEADINGS, ModalPaths } from "~/constants";
import { LatencyInfo } from "~/interfaces";
import { PerformanceMeasurement } from "~/utilities/performance";

export default ({
  onModalClose,
  performanceMeasurement,
}: {
  onModalClose: () => void;
  performanceMeasurement: PerformanceMeasurement | undefined;
}) => {
  const perfs = performanceMeasurement?.getPerformances();
  return (
    <div
      id={getModalId(ModalPaths.ShowLatencyModal)}
      className={`modal modal-open size-xs`}
    >
      <div className="modal-box max-w-2xl">
        <table className="table w-full">
          <thead>
            <tr>
              {LATENCY_HEADINGS.map((heading) => {
                const textStyle = heading === "actions" ? "text-center" : "";
                return (
                  <th className={textStyle} key={heading}>
                    {heading}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {perfs &&
              perfs?.length > 0 &&
              perfs.reverse().map((data: LatencyInfo, index: number) => (
                <tr key={`${ModalPaths.ShowLatencyModal}_${index}`}>
                  <td>
                    <span
                      data-tip={data.Path}
                      className="tooltip tooltip-bottom"
                    >
                      {truncate(data.Path)}
                    </span>
                  </td>
                  <td>
                    <span
                      data-tip={data.Status}
                      className="tooltip tooltip-bottom"
                    >
                      {truncate(data.Status)}
                    </span>
                  </td>
                  <td>
                    <span
                      data-tip={data.Method}
                      className="tooltip tooltip-bottom"
                    >
                      {truncate(data.Method)}
                    </span>
                  </td>
                  <td>
                    <span
                      data-tip={data.Size}
                      className="tooltip tooltip-bottom"
                    >
                      {truncate(data.Size)}
                    </span>
                  </td>
                  <td>
                    <span
                      data-tip={data.Time}
                      className="tooltip tooltip-bottom"
                    >
                      {truncate(data.Time)}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="modal-action right-0">
          <a onClick={onModalClose} className="btn">
            Close
          </a>
        </div>
      </div>
    </div>
  );
};
