import { ActionButtons } from "./constants";

export interface DataCenter {
  name: string;
  tags: {
    api: string;
  };
  locationInfo: {
    city: string;
    countrycode: string;
  };
}

export interface RegionInfo {
  dcInfo: Array<DataCenter>;
  tenant: string;
}

export interface PiiData {
  email: string;
  name: string;
  phone: string;
  token: string;
}

export interface LocationData {
  token: string;
  state: string;
  country: string;
  zipcode: string;
  job_title: string;
}

export interface UserData extends PiiData, LocationData {}

export interface RowProps {
  activeRow: string;
  data: PiiData & LocationData;
  isPrivateRegion: string;
  setActiveRow: (arg: string) => void;
  onActionButtonClicked: (action: ActionButtons, details: UserData) => void;
}

export interface ModalProps {
  modalUserDetails: UserData;
  onModalClose: () => void;
}

export interface CommonShareModalProps {
  endpoint: string;
  onModalClose: () => void;
  piiToken: string;
}

export type EditModalProps = ModalProps & {
  showModal: boolean;
  formAction: string;
  shouldDecrypt?: boolean;
};

export interface AddContactModalProps
  extends Omit<ModalProps, "modalUserDetails"> {}

interface UserManagementActionSuccess {
  isPrivate: boolean;
}
interface UserManagementActionFail {
  error: boolean;
  errorMessage: string;
  name: string;
}

export type UserManagementActionResult =
  | UserManagementActionSuccess
  | UserManagementActionFail;

export interface Context {
  addContactModal: {
    showAddContactModal: boolean;
    setShowAddContactModal: (show: boolean) => void;
  };
  addLatencyModal: {
    showLatencyModal: boolean;
    setShowLatencyModal: (show: boolean) => void;
  };
}

export interface HeaderProps {
  setShowAddContactModal: (show: boolean) => void;
  setShowLatencyModal: (show: boolean) => void;
}

export interface LatencyInfo {
  Name: string,
  Status: string,
  Time: string,
  Method: string,
  Size: string
}
