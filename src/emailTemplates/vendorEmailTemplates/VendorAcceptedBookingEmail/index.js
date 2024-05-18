import React from "react";
import EmailFooter from "../../reusable/EmailFooter/index.js";
const VendorAcceptedBookingEmailTemplate = (_ref) => {
  let {
    pickupLocation,
    passengerName,
    passengerMobile,
    pickupDate,
    pickupTime,
  } = _ref;
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
        "Booking Confirmation"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Dear Vendor,"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "This is to confirm that you have accepted the booking with the following details:"
      ),
      /*#__PURE__*/ React.createElement(
        "ul",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        /*#__PURE__*/ React.createElement(
          "li",
          null,
          /*#__PURE__*/ React.createElement("strong", null, "Pickup Location:"),
          " ",
          pickupLocation
        ),
        /*#__PURE__*/ React.createElement(
          "li",
          null,
          /*#__PURE__*/ React.createElement("strong", null, "Pickup Date:"),
          " ",
          pickupDate
        ),
        /*#__PURE__*/ React.createElement(
          "li",
          null,
          /*#__PURE__*/ React.createElement("strong", null, "Pickup Time:"),
          " ",
          pickupTime
        ),
        /*#__PURE__*/ React.createElement(
          "li",
          null,
          /*#__PURE__*/ React.createElement("strong", null, "Passenger Name:"),
          " ",
          passengerName
        ),
        /*#__PURE__*/ React.createElement(
          "li",
          null,
          /*#__PURE__*/ React.createElement(
            "strong",
            null,
            "Passenger Contact:"
          ),
          " ",
          passengerMobile
        )
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Thank you for your confirmation. The booking is now scheduled as per the provided details."
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
export default VendorAcceptedBookingEmailTemplate;
