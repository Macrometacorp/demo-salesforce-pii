export enum Session {
  Jwt = "jwt",
  Tenant = "tenant",
  PiiToken = "pii-token",
}

export enum SessionStorage {
  IsPrivateRegion = "isPrivateRegion",
  Region = "region",
  LatencyData = "latencyData"
}

export enum AppPaths {
  Root = "/",
  Login = "/login",
  Region = "/region",
  UserManagement = "/user-management",
  Logout = "/logout",
  UserLogin = "/user-login",
  UserDetails = "/user-details",
}

export enum ModalPaths {
  EditModal = "#edit-modal",
  RemoveModal = "#remove-modal",
  ShareModal = "#share-modal",
  AddContactModal = "#contact-modal",
  ShowDecryptedModal = "#decrypted-modal",
  ShowEditForgetModal = "#edit-forget-modal",
  ShowLatencyModal = "#latency-model",
}

export enum ToastTypes {
  Success = "Success",
  Error = "Error",
  Info = "Info",
}

export const HEADINGS = [
  "first name",
  "last name",
  "email",
  "phone",
  "state",
  "country",
  "zipcode",
  "job title",
  "actions",
];

export enum ResourceEndpoints {
  Edit = "/edit",
  Forget = "/forget",
}

export enum Fabrics {
  Global = "pii_global_sf",
  Eu = "pii_eu_sf",
}

export enum Collections {
  Users = "users",
  UserLeadInfo = "user_lead_info",
}

export const MM_TOKEN_PREFIX = "mm_";

export const TRUNCATE_LENGTH = 30;

export const CONTACTS_PER_PAGE = 10;

export const SHAREABLE_CURL_COMMAND_MESSAGE =
  "Loading Shareable Curl Command...";

export const Queries = {
  GetUsers: () => `FOR doc IN ${Collections.Users} RETURN doc`,

  GetLocations: () => `FOR doc in ${Collections.UserLeadInfo} RETURN doc`,

  InsertUser: () =>
    `INSERT { _key: @token, token: @token, name: @name, email: @email, phone: @phone,firstName:@firstName, lastname:@lastname } INTO ${Collections.Users}`,

  UpdateUser: (updateWhat: string) =>
    `FOR user IN ${Collections.Users} UPDATE { _key: @token, ${updateWhat} } IN ${Collections.Users}`,

  InsertLocation: () =>
    `INSERT { _key: @token, token: @token, state: @state, country: @country, zipcode: @zipcode, job_title: @job_title } INTO ${Collections.UserLeadInfo}`,

  UpdateLocation: (updateWhat: string) =>
    `FOR loc in ${Collections.UserLeadInfo} UPDATE { _key: @token, ${updateWhat} } IN ${Collections.UserLeadInfo}`,

  SearchUserByEmail: () =>
    `FOR user IN ${Collections.Users} FILTER user.email == @email RETURN user`,

  SearchUserByToken: () =>
    `FOR user IN ${Collections.Users} FILTER user._key == @token RETURN user`,

  SearchLocationByToken: () =>
    `FOR location IN ${Collections.UserLeadInfo} FILTER location.token == @token RETURN location`,

  DeleteUser: () => `REMOVE { _key: @token } IN ${Collections.Users}`,

  DeleteLocation: () =>
    `REMOVE { _key: @token } IN ${Collections.UserLeadInfo}`,
  
  SalesforceLeadQuery:()=>"Select id,salutation,name,firstname,lastname,title,company,street,city,state,postalCode,country,phone,email,website,leadsource,status,industry,rating,IsUnreadByOwner,NumberOfEmployees from lead"
  
};


export const optionsObj = {
  headers: {
    "content-type": "application/json",
  },
};

export const createJobBody = JSON.stringify({
  object: "Lead",
  operation: "insert",
  contentType: "CSV",
  lineEnding : "CRLF"
});


export enum ActionButtons {
  Edit = "EDIT",
  Remove = "REMOVE",
  Share = "SHARE",
  Show = "SHOW",
}

export enum HttpMethods {
  Get = "get",
  Post = "post",
  Put = "put",
  Delete = "delete",
}

export enum FormButtonActions {
  Name = "_perform",
  Create = "create",
  Update = "update",
  Delete = "delete",
  Upload = "upload",
  RefreshCache = "refreshCache"
}

export const LATENCY_HEADINGS = ["path", "status", "method", "size", "time"];

export enum LatencyRequest {
  Type = "resource",
  FETCH = "fetch",
}
