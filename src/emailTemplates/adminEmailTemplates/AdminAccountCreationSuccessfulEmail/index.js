import React from "react";
const AdminAccountCreationSuccessfulEmailTemplate = _ref => {
  let {
    fullName,
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
  }, "Your admin account has been setup"), role == "Blogger" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px"
    }
  }, "As a blogger on Shuttlelane, you have all the priviledges of a blogger which includes:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "Writing blog posts"), /*#__PURE__*/React.createElement("li", null, "Editing blog posts"), /*#__PURE__*/React.createElement("li", null, "Deleting blog posts"), /*#__PURE__*/React.createElement("li", null, "See and track recent bookings, etc")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px"
    }
  }, "Please, make sure to adhere strictly to our terms of use while using this account.")), role == "Super Admin" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px"
    }
  }, "As a Super Admin on Shuttlelane, you have the full priviledges of a Super Admin which includes:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "Writing blog posts"), /*#__PURE__*/React.createElement("li", null, "Editing blog posts"), /*#__PURE__*/React.createElement("li", null, "Deleting blog posts"), /*#__PURE__*/React.createElement("li", null, "See and track recent bookings"), /*#__PURE__*/React.createElement("li", null, "Assign bookings to drivers and vendors"), /*#__PURE__*/React.createElement("li", null, "Update booking status"), /*#__PURE__*/React.createElement("li", null, "Modify booking and exchange rates, etc")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px"
    }
  }, "Please, make sure to adhere strictly to our terms of use while using this account.")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#888"
    }
  }, "Best Regards,", /*#__PURE__*/React.createElement("br", null), "The Shuttlelane Team.")));
};
export default AdminAccountCreationSuccessfulEmailTemplate;