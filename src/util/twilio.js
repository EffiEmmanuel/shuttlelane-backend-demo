require("dotenv").config();

function sendSMS(phone, message) {
  //   const accountSid = "AC3319551d170c34d5e479c10b28e5ffef";
  //   const authToken = "16fde20d11c8a9782b9ea891e57187f9";
  const accountSid = process.env.TWILO_ACCOUNT_SID;
  const authToken = process.env.TWILO_AUTH_TOKEN;
  const providerNumber = process.env.TWILIO_PHONE_NUMBER;
  //   const providerNumber = "+447429738615";
  const client = require("twilio")(accountSid, authToken);
  console.log("sending SMS", process.env.TWILIO_ACCOUNT_SID);
  client.messages
    .create({
      body: message,
      from: providerNumber,
      to: phone,
    })
    .then((message) => {
      console.log("Sent");
      console.log(message.sid);
    })
    .catch((err) => {
      console.log("ERROR:", err);
    });
}

module.exports = sendSMS;
