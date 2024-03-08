import React from "react";
const DriverAccountApprovalEmail = _ref => {
  let {
    driver
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
  }, "Your Driver Account has been Approved!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Dear ", driver === null || driver === void 0 ? void 0 : driver.firstName, ","), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "We are excited to inform you that your driver account has been approved!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "You can now start receiving job requests and access your dashboard to manage your profile and view upcoming assignments."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "If you have any questions or need assistance, please don't hesitate to contact us."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Thank you for joining our team!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333"
    }
  }, "Best regards,"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "The Shuttlelane Team")));
};
export default DriverAccountApprovalEmail;