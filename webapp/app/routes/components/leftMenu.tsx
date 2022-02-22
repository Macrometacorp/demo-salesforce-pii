import { HeaderProps } from '../../interfaces';
import LatencySVG from './svgs/latency';

export default ({ setShowLatencyModal }: HeaderProps) => {
    return (
        <div>
            <button
                  className="btn btn-square btn-md text-center"
                  data-tip="View Latency"
                  onClick={() => {
                    setShowLatencyModal(true);
                    console.log("set modal")
                  }}
            >
              <LatencySVG />
            </button>
        </div>
    )
};
