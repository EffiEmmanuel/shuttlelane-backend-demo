import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";

// TO-DO: Remove Twilio Secrets
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

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
