import React from "react";
import EmailHeader from "../../reusable/EmailHeader/index.js";
import EmailFooter from "../../reusable/EmailFooter/index.js";
const UserBookingCompletedEmailTemplate = (_ref) => {
  let { bookingReference, firstName } = _ref;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      style: {
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f5f5f5",
        color: "#333333",
        margin: "0",
        padding: "20px",
      },
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        style: {
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "5px",
        },
      },
      /*#__PURE__*/ React.createElement("img", {
        src: "https://shuttlelane.com/static/media/logo.46684879b753af396f9a.png",
        alt: "Shuttlelane Limited",
        width: "150",
        height: "auto",
        style: {
          maxWidth: "100%",
        },
      }),
      /*#__PURE__*/ React.createElement(
        "h1",
        {
          style: {
            fontWeight: "600",
            marginTop: "20px",
            marginBottom: "10px",
          },
        },
        "Trip Completed: ",
        bookingReference
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            lineHeight: "1.5",
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
            lineHeight: "1.5",
            marginBottom: "20px",
          },
        },
        "Your trip has been marked as complete."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            lineHeight: "1.5",
            marginBottom: "20px",
          },
        },
        "Thank you for choosing Shuttlelane. We look forward to knowing how your experience was."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            lineHeight: "1.5",
            marginBottom: "20px",
          },
        },
        "Best regards,",
        /*#__PURE__*/ React.createElement("br", null),
        "The Shuttlelane Team."
      )
    ),
    /*#__PURE__*/ React.createElement(EmailFooter, null)
  );
};
export default UserBookingCompletedEmailTemplate;
