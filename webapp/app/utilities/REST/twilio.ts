export const sendMessage = async ( requestBody: any) =>{
let token = btoa(`${TWILIO_ACCOUNT_SID}` + ":" + `${TWILIO_AUTH_TOKEN}`)
 const result= await fetch(`${TWILIO_MESSAGE_ENDPOINT}${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    body:requestBody ,
    headers: {
        "Authorization": `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
  });
  return result
}
