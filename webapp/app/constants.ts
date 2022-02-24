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
  UserDetails = "/user-details"
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
  "company",
  "status",
  "source",
  "country",
  "postal code",
  "title",
  "actions",
];

export enum ResourceEndpoints {
  Edit = "/edit",
  Forget = "/forget"
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

  UpdateLocation: () =>
  `UPDATE @_key with {"value": @value } IN ${Collections.UserLeadInfo}`,

  SearchUserByEmail: () =>
    `FOR user IN ${Collections.Users} FILTER user.email == @email RETURN user`,

  SearchUserByToken: () =>
    `FOR user IN ${Collections.Users} FILTER user._key == @token RETURN user`,

  SearchLocationByToken: () =>
    `FOR doc in ${Collections.UserLeadInfo} 
    filter doc.value[*].token ANY == @token
    RETURN {
      "Id": doc.value[0].Id,
      "Name": doc.value[0].Name,
      "FirstName": doc.value[0].FirstName,
      "LastName": doc.value[0].LastName,
      "Title": doc.value[0].Title,
      "Company": doc.value[0].Company,
      "Street": doc.value[0].Street,
      "City": doc.value[0].City,
      "State": doc.value[0].State,
      "PostalCode": doc.value[0].PostalCode,
      "Country": doc.value[0].Country,
      "Phone": doc.value[0].Phone,
      "Email": doc.value[0].Email,
      "Website": doc.value[0].Website,
      "LeadSource": doc.value[0].LeadSource,
      "Status": doc.value[0].Status,
      "Industry": doc.value[0].Industry,
      "Rating": doc.value[0].Rating,
      "IsUnreadByOwner": doc.value[0].IsUnreadByOwner,
      "NumberOfEmployees": doc.value[0].NumberOfEmployees,
      "token": doc.value[0].token,
      "isUploaded": doc.value[0].isUploaded,
      "_key": doc._key
  }`,

  DeleteUser: () => `REMOVE { _key: @token } IN ${Collections.Users}`,

  DeleteUserLeadInfo: () =>
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
  RefreshCache = "refreshCache",
  BulkUpload = "bulkUpload"
}

export const LATENCY_HEADINGS = ["path", "status", "method", "size", "time"];

export enum LatencyRequest {
  Type = "resource",
  FETCH = "fetch",
}
