import { getModalId, truncate } from "~/utilities/utils";
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
      <div className="modal-box max-w-6xl overflow-hidden">
        <div className="container">
          <table className="table w-full">
            <thead className="flex w-full">
              <tr className="flex w-full">
                {LATENCY_HEADINGS.map((heading, index) => {
                  const widthClass = index == 0 ? "w-96" : "w-44";
                  return (
                    <th className={widthClass} key={heading}>
                      {heading}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="flex flex-col items-center overflow-y-scroll w-full h-[400px]">
              {perfs &&
                perfs?.length > 0 &&
                perfs.reverse().map((data: LatencyInfo, index: number) => (
                  <tr
                    key={`${ModalPaths.ShowLatencyModal}_${index}`}
                    className="flex w-full hover"
                  >
                    <td className="w-96">
                      <span
                        data-tip={data.Path}
                        className="tooltip tooltip-bottom"
                      >
                        {truncate(data.Path, 40)}
                      </span>
                    </td>
                    <td className="w-44">
                      <span
                        data-tip={data.Status}
                        className="tooltip tooltip-bottom"
                      >
                        {truncate(data.Status)}
                      </span>
                    </td>
                    <td className="w-44">
                      <span
                        data-tip={data.Method}
                        className="tooltip tooltip-bottom"
                      >
                        {truncate(data.Method)}
                      </span>
                    </td>
                    <td className="w-44">
                      <span
                        data-tip={data.Size}
                        className="tooltip tooltip-bottom"
                      >
                        {truncate(data.Size)}
                      </span>
                    </td>
                    <td className="w-44">
                      <span
                        data-tip={data.Time}
                        className="tooltip tooltip-bottom"
                      >
                        {truncate(data.Time)}
                      </span>
                    </td>
                  </tr>
                ))}
              {perfs?.length == 0 && (
                <div className="flex justify-center">
                  <p className="mb-5 text-xl font-bold">No latency found</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
        <div className="modal-action right-0">
          <a onClick={onModalClose} className="btn">
            Close
          </a>
        </div>
      </div>
    </div>
  );
};
