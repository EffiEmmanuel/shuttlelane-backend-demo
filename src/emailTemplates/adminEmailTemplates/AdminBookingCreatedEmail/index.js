import React from "react";
const AdminBookingCreatedEmailTemplate = _ref => {
  let {
    bookingReference,
    firstName,
    lastName,
    mobile,
    email
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
  }, "\uD83D\uDD14 New Booking Alert"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Dear admin,"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "A user has just made a booking with the following details:"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Booking Reference Number: ", /*#__PURE__*/React.createElement("strong", null, bookingReference)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Full Name:", " ", /*#__PURE__*/React.createElement("strong", null, firstName, " ", lastName)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Phone Number: ", /*#__PURE__*/React.createElement("strong", null, mobile)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Email Address: ", /*#__PURE__*/React.createElement("strong", null, email)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Please ensure to reach out to them as soon as possible and assign a partner to this booking if necessary."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "You can also track this booking via", " ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: "#333",
      textDecoration: "underline"
    },
    href: "https://www.shuttlelane.com/track-booking?bookingReference=".concat(bookingReference)
  }, "this link on the website."), "."), /*#__PURE__*/React.createElement("p", {
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
export default AdminBookingCreatedEmailTemplate;