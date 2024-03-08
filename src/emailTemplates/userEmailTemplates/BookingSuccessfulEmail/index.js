import React from "react";
const BookingSuccessfulEmail = _ref => {
  let {
    bookingReference
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f4f4f4"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333"
    }
  }, "Booking Successfully Created"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Dear valued customer,"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Your booking has been successfully created with the following details:"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Booking Reference Number: ", /*#__PURE__*/React.createElement("strong", null, bookingReference)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Please ensure to complete your payment in order to validate your booking."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "You can also track your booking via", " ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: "#333",
      textDecoration: "underline"
    },
    href: "https://localhost:3000/track-booking?bookingReference=".concat(bookingReference)
  }, "this link on our website"), "."), /*#__PURE__*/React.createElement("a", {
    href: "PAYMENT_URL_HERE",
    style: {
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "5px",
      textAlign: "center",
      marginBottom: "20px"
    }
  }, "Make Payment"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Thank you for choosing our service!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333"
    }
  }, "Best regards,"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "The Shuttlelane Booking Team.")));
};
export default BookingSuccessfulEmail;