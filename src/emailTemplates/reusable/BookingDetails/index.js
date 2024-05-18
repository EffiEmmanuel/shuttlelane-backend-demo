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
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "green",
      color: "#fff",
      padding: "10px",
      textAlign: "center",
      borderRadius: "10px 10px 0 0",
      width: "100%",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0
    }
  }, "BOOKING DETAILS")), /*#__PURE__*/React.createElement("div", {
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