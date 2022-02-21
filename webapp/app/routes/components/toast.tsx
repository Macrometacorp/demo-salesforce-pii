import { ToastTypes } from "~/constants";

export default ({
  toastType,
  message,
  showToast,
  closeToast
}: {
  toastType: ToastTypes;
  message: string;
  showToast: boolean;
  closeToast: () => void
}) => {

  let classes = "";
  switch (toastType) {
    case ToastTypes.Success:
      classes += "bg-green-500 ";
      break;
    case ToastTypes.Error:
      classes += "bg-red-600 ";
      break;
    case ToastTypes.Info:
      classes += "bg-blue-500 ";
      break;
    default:
    classes += "bg-yellow-500 ";
    break;  
  }

  return (
    <>
      {showToast ? (
        <div className="flex flex-col justify-center text-center  absolute left-0 right-0 bottom-5">
          <div
            className={`${classes} shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg  mb-3`}
            id="static-example"
          >
            <div className="flex justify-between">
            <div
              className={`p-3 ${classes} rounded-b-lg break-words text-white`}
            >
              {message}
            </div>
            <button
              className={`p-3 ${classes} rounded-b-lg break-words text-white`} 
              onClick={()=>closeToast()}
            >
              &times;
            </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
