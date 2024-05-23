import React from "react";
import EmailHeader from "../../reusable/EmailHeader";
import EmailFooter from "../../reusable/EmailFooter";
import BookingDetails from "../../reusable/BookingDetails";
import TotalBilledSection from "../../reusable/TotalBilled";
const BookingSuccessfulEmail = _ref => {
  var _booking$user$title, _booking$user, _booking$user$firstNa, _booking$user2;
  let {
    bookingReference,
    booking,
    bookingType,
    bookingDetails,
    totalBilled
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "Poppins, sans-serif",
      backgroundColor: "#f5f5f5",
      color: "#333333",
      margin: "0",
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "5px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "company_logo.png",
    alt: "Shuttlelane Limited",
    style: {
      maxWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontWeight: "600",
      marginTop: "20px",
      marginBottom: "10px"
    }
  }, "Welcome to Our Company"), /*#__PURE__*/React.createElement("p", {
    style: {
      lineHeight: "1.5",
      marginBottom: "20px"
    }
  }, "Dear ", (_booking$user$title = booking === null || booking === void 0 || (_booking$user = booking.user) === null || _booking$user === void 0 ? void 0 : _booking$user.title) !== null && _booking$user$title !== void 0 ? _booking$user$title : booking === null || booking === void 0 ? void 0 : booking.title, " ", (_booking$user$firstNa = booking === null || booking === void 0 || (_booking$user2 = booking.user) === null || _booking$user2 === void 0 ? void 0 : _booking$user2.firstName) !== null && _booking$user$firstNa !== void 0 ? _booking$user$firstNa : booking === null || booking === void 0 ? void 0 : booking.firstName, ","), /*#__PURE__*/React.createElement("p", {
    style: {
      lineHeight: "1.5",
      marginBottom: "20px"
    }
  }, "Thank you for booking your ", bookingType, " with Shuttlelane."), /*#__PURE__*/React.createElement(BookingDetails, {
    details: {
      ...bookingDetails,
      TOTAL: totalBilled
    },
    endNote: ""
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      lineHeight: "1.5",
      marginBottom: "20px"
    }
  }, "Thank you for choosing Shuttlelane. We look forward to providing you with an exceptional experience."), /*#__PURE__*/React.createElement("p", {
    style: {
      lineHeight: "1.5",
      marginBottom: "20px"
    }
  }, "Best regards,", /*#__PURE__*/React.createElement("br", null), "The Shuttlelane Team.")), /*#__PURE__*/React.createElement(EmailFooter, null));
};
export default BookingSuccessfulEmail;