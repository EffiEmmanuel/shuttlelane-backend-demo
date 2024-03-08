import React from "react";

// BookingDetails component
const BookingDetails = _ref => {
  let {
    details,
    endNote
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: "booking-details",
    style: {
      backgroundColor: " #fff",
      borderRadius: "8px",
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Booking Details"), /*#__PURE__*/React.createElement("div", {
    className: "booking-info",
    style: {
      marginBottom: "10px"
    }
  }, Object.entries(details).map(_ref2 => {
    let [key, value] = _ref2;
    return /*#__PURE__*/React.createElement("p", {
      key: key,
      style: {
        margin: "5px 0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: "bold"
      }
    }, key, ":"), " ", value);
  })), /*#__PURE__*/React.createElement("p", null, endNote));
};
export default BookingDetails;