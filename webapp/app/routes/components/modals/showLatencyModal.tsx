import { useEffect, useRef } from 'react';
import { LoaderFunction, useFetcher } from 'remix';
import { getModalId, isLoggedIn, truncate } from '~/utilities/utils';
import { LATENCY_HEADINGS, ModalPaths } from '~/constants';
import { LatencyInfo } from '../../../interfaces';
import Row from '../tableRow';

export default ({
  showModal,
  onModalClose,
  modalLatencyDetails
}: {
  showModal: boolean;
  onModalClose: () => void;
  modalLatencyDetails: LatencyInfo[]
}) => {
  return (
    <div
      id={getModalId(ModalPaths.ShowLatencyModal)}
      className={`modal ${showModal ? 'modal-open' : 'modal-close'} size-xs`}
    >
      <div className='modal-box'>
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
          { modalLatencyDetails.length > 0 &&
            modalLatencyDetails.map((data: LatencyInfo, index: number) => (
              <tr key={`${ModalPaths.ShowLatencyModal}_${index}`}>
                <td><span data-tip={data.Name} className="tooltip tooltip-bottom">{truncate(data.Name)}</span></td>
                <td><span data-tip={data.Status} className="tooltip tooltip-bottom">{truncate(data.Status)}</span></td>
                <td><span data-tip={data.Method} className="tooltip tooltip-bottom">{truncate(data.Method)}</span></td>
                <td><span data-tip={data.Size} className="tooltip tooltip-bottom">{truncate(data.Size)}</span></td>
                <td><span data-tip={data.Time} className="tooltip tooltip-bottom">{truncate(data.Time)}</span></td>
              </tr>
            ))
          }
        </tbody>
        </table>
        <div className="modal-action">
          <a onClick={onModalClose} className="btn">
            Close
          </a>
        </div>
      </div>
    </div>
  );
};
