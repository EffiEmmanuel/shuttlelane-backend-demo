import React from "react";
import EmailHeader from "../../reusable/EmailHeader/index.js";
import EmailFooter from "../../reusable/EmailFooter/index.js";
const UserBookingCompletedEmailTemplate = (_ref) => {
  let { bookingReference, firstName } = _ref;
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
        "Trip Completed: ",
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
        "We're pleased to inform you that your trip for booking",
        " ",
        bookingReference,
        " has been marked as completed."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "We hope you had a pleasant experience with ShuttleLane. Your feedback is valuable to us."
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
export default UserBookingCompletedEmailTemplate;
