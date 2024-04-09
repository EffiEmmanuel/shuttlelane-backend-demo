import React from "react";
import Header from "../../reusable/Header/index.js";
import BookingDetails from "../../reusable/BookingDetails/index.js";

// Main EmailTemplate component
const AssignToBookingEmailTemplate = (_ref) => {
  let { booking, driverId } = _ref;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "container",
      style: {
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#f7f7f7",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      },
    },
    /*#__PURE__*/ React.createElement(Header, {
      title: "New Booking Assignment",
    }),
    /*#__PURE__*/ React.createElement(BookingDetails, {
      details: booking,
      endNote:
        "We are pleased to inform you that you have been assigned to this new\r booking. Please arrive on time and ensure a smooth transfer for our\r valued customer.",
    }),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        style: {
          textAlign: "center",
          marginTop: "20px",
          color: "#777",
        },
        className: "footer",
      },
      /*#__PURE__*/ React.createElement(
        "a",
        {
          href: "https://www.shuttlelane.com/driver/dashboard",
          style: {
            display: "inline-block",
            padding: "10px 20px",
            margin: "0 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
            backgroundColor: "#E2B442",
            color: "#181818",
            textDecoration: "none",
          },
          className: "action-button accept-button",
        },
        "Log in"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            textAlign: "center",
            color: "#333",
          },
        },
        "Thank you for your service"
      )
    )
  );
};
export default AssignToBookingEmailTemplate;
