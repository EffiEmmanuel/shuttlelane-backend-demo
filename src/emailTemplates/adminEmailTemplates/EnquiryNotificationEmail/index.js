import React from "react";
const EnquiryNotificationTemplate = _ref => {
  let {
    fullName,
    email,
    message
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
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#333",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center"
    }
  }, "New Message/Enquiry"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Full Name:"), " ", fullName), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Email Address:"), " ", email), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Message: "), /*#__PURE__*/React.createElement("span", {
    style: {}
  }, message)), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px"
    }
  }, "Please take appropriate action to respond to the enquiry as soon as possible."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#888"
    }
  }, "Best Regards,", /*#__PURE__*/React.createElement("br", null), "The Shuttlelane Team.")));
};
export default EnquiryNotificationTemplate;