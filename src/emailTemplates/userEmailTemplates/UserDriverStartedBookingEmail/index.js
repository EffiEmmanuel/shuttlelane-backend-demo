import React from "react";
import EmailHeader from "../../reusable/EmailHeader/index.js";
import EmailFooter from "../../reusable/EmailFooter/index.js";
const UserDriverStartedBookingEmailTemplate = (_ref) => {
  let { bookingReference, title, firstName, driverName, driverContact } = _ref;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      style: {
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f4f4f4",
      },
    },
    /*#__PURE__*/ React.createElement(EmailHeader, null),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
        },
      },
      /*#__PURE__*/ React.createElement(
        "h1",
        {
          style: {
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
          },
        },
        "Driver Started Your Trip: ",
        bookingReference
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Dear ",
        title,
        " ",
        firstName,
        ","
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "We're excited to inform you that your driver, ",
        driverName,
        ", has started your trip. You can contact your driver at ",
        driverContact,
        " if needed."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Your safety and comfort are our top priorities. Enjoy your trip with ShuttleLane!"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
          },
        },
        "Best regards,"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "The ShuttleLane Team"
      )
    ),
    /*#__PURE__*/ React.createElement(EmailFooter, null)
  );
};
export default UserDriverStartedBookingEmailTemplate;
