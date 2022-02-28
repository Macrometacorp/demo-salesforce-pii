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
  Id ?: string;
  IsUnreadByOwner ?: string;
  token: string;
  Company: string;
  Status: string;
  Title: string;
  NumberOfEmployees: string;
  Website:string;
  LeadSource: string;
  Industry: string;
  Rating: string;
  Street: string;
  City: string;
  State: string;
  Country: string;
  PostalCode: string;
  isUploaded: string;
}

export interface UserConsent {
  _key : string;
  ConsentRequested ?: boolean;
}

export interface UserData extends PiiData, LocationData, LeadInfo, UserConsent  {}
export interface CsvUserData {
  company: string;
  status: string;
  title: string;
  numberOfEmployees: string;
  website:string;
  leadSource: string;
  industry: string;
  rating: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  name: string;
  phone: string;
  token: string;
  firstname: string;
  lastname: string;
}
export interface RowProps {
  activeRow: string;
  data: PiiData & LocationData & LeadInfo & UserConsent;
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

export type ConsentModalProps = {
  showModal: boolean;
  token : string;
  formAction?: string;
  onModalClose: () => void;
};
