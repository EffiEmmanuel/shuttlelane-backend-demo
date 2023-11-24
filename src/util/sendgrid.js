// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
import axios from "axios";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async function sendEmail(message) {
//   try {
//     sgMail
//       .send(message)
//       .then((res) => {
//         console.log("Email sent");
//         return {
//           status: 200,
//           message: "Email sent successfully!",
//         };
//       })
//       .catch((err) => {
//         console.log("Sendgrid Error", err);
//         return {
//           status: 500,
//           message: "An error occured while sending the email",
//         };
//       });
//   } catch (err) {
//     console.error("Sendgrid Outer Catch Error", err);
//     return {
//       status: 500,
//       message: "An error occured while sending the email",
//     };
//   }
// }
const apiKey = `${process.env.SENDGRID_API_KEY}`;

export const sendEmail = async (recipient, subject, content) => {
  const data = {
    personalizations: [
      {
        to: [{ email: recipient }],
        subject: subject,
      },
    ],
    from: { email: "info@shuttlelane.com" },
    content: [{ type: "text/html", value: content }],
  };

  try {
    const response = await axios.post(
      "https://api.sendgrid.com/v3/mail/send",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log("Email sent successfully:", response.data);
    return {
      status: 200,
      message: "Email sent successfully!",
    };
  } catch (error) {
    console.error("Error sending email:", error.response.data);
    return {
      status: 500,
      message: "Email failed to send. Please try again",
    };
  }
};

export const sendBulkEmail = async (recipients, subject, emailContent) => {
  let emailRecipients = [];
  recipients?.forEach((recipient) => {
    emailRecipients.push({
      email: recipient?.email,
      name: `${recipient?.firstName} ${recipient?.lastName}`,
    });
  });

  const personalizedEmails = emailRecipients.map((recipient) => ({
    to: [{ email: recipient.email, name: recipient.name }],
    subject: subject,
  }));

  const data = {
    personalizations: personalizedEmails,
    from: { email: "info@shuttlelane.com" },
    content: [
      {
        type: "text/html",
        value: emailContent,
      },
    ],
  };

  try {
    const response = await axios.post(
      "https://api.sendgrid.com/v3/mail/send",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log("Bulk email sent successfully:", response.data);
    return {
      status: 200,
      message: "Bulk email sent successfully!",
    };
  } catch (error) {
    console.error("Error sending bulk email:", error.response.data);
    return {
      status: 500,
      message: "Bulk email failed to send. Please try again",
    };
  }
};
