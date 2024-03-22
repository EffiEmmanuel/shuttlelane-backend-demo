import React from "react";
const VendorSignupConfirmationEmail = vendor => {
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
  }, "Vendor Account Created Successfully\uD83C\uDF89"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "10px"
    }
  }, "Dear ", vendor === null || vendor === void 0 ? void 0 : vendor.contactName, ","), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Congratulations! Your vendor account has been successfully created on behalf of ", vendor === null || vendor === void 0 ? void 0 : vendor.companyName, "."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Your account will be reviewed by our team within the next 72 hours. In the meantime, feel free to explore our platform and familiarize yourself with all of our various services."), /*#__PURE__*/React.createElement("p", {
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
export default VendorSignupConfirmationEmail;