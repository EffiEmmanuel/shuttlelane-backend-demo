import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = "AC3319551d170c34d5e479c10b28e5ffef";
const TWILIO_AUTH_TOKEN = "de4d267b8710a4ceb4a1f2e293a6bf68";
const TWILIO_PHONE_NUMBER = "+447429738615";

export async function sendSMS(phone, message) {
  const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log("sending SMS", `${TWILIO_ACCOUNT_SID}`);
  await twilioClient.messages
    .create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    })
    .then((message) => {
      console.log("Sent");
      console.log(message.sid);
    })
    .catch((err) => {
      console.log("ERROR from here:", err);
    });
}
