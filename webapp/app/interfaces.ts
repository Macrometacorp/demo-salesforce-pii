import { ActionButtons } from "./constants";
import { PerformanceMeasurement } from "./utilities/performance";

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
  firstName: string;
  lastname: string;
}

export interface LocationData {

    _id: string;
    _key: string;
    _rev: string;
    expireAt: number,
    value: Array<LeadInfo>

}

export interface LeadInfo {
  token: string;
  company: string;
  leadStatus: string;
  title: string;
  NumberOfEmployees: string;
  website:string;
  leadSource: string;
  industry: string;
  rating: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isUploaded: string;
}

export interface UserData extends PiiData, LocationData,LeadInfo  {}

export interface RowProps {
  activeRow: string;
  data: PiiData & LocationData & LeadInfo;
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
  performanceMeasurement: PerformanceMeasurement | undefined;
}

export interface HeaderProps {
  setShowAddContactModal: (show: boolean) => void;
  setShowLatencyModal: (show: boolean) => void;
}

export interface LatencyInfo {
  Name: string;
  Path: string;
  Status: string;
  Time: string;
  Method: string;
  Size: string;
}
