import React from "react";
const AdminAccountCreationEmailTemplate = _ref => {
  let {
    fullName,
    email,
    username,
    role,
    _id
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
  }, "Your admin account has been created"), /*#__PURE__*/React.createElement("p", {
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
  }, /*#__PURE__*/React.createElement("strong", null, "Username: "), /*#__PURE__*/React.createElement("span", {
    style: {}
  }, username)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Role: "), /*#__PURE__*/React.createElement("span", {
    style: {}
  }, role)), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px"
    }
  }, "Complete your account creation by clicking the button below:"), /*#__PURE__*/React.createElement("a", {
    href: "http://localhost:3000/admin/complete-signup?adminId=".concat(_id),
    style: {
      display: "inline-block",
      padding: "10px 20px",
      margin: "0 10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
      backgroundColor: "#28a745",
      color: "#fff",
      textDecoration: "none"
    },
    className: "action-button accept-button"
  }, "Complete Signup"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#888"
    }
  }, "Best Regards,", /*#__PURE__*/React.createElement("br", null), "The Shuttlelane Team.")));
};
export default AdminAccountCreationEmailTemplate;