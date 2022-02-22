import { HeaderProps } from '~/interfaces';
import UploadSVG from '~/routes/components/svgs/upload';

export default ({ setShowLatencyModal }: HeaderProps) => {
  return (
    <div>
      <button
        className='btn btn-square btn-ghost tooltip tooltip-right'
        data-tip='View Latency'
        onClick={() => {
          setShowLatencyModal(true);
        }}
      >
        <UploadSVG />
      </button>
    </div>
  );
};
