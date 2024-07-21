import React from "react";
import EmailFooter from "../../reusable/EmailFooter/index.js";
const DriverResetPasswordEmailTemplate = (_ref) => {
  let { driverId } = _ref;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      style: {
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f4f4f4",
      },
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
        },
      },
      /*#__PURE__*/ React.createElement(
        "h1",
        {
          style: {
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
          },
        },
        "Reset Your Password"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "We just received a request to reset your password. Kindly click on the button below to reset your account's password"
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          style: {
            textAlign: "center",
            marginTop: "20px",
            color: "#777",
          },
          className: "footer",
        },
        /*#__PURE__*/ React.createElement(
          "a",
          {
            href: "https://www.shuttlelane.com/driver/auth/reset-password?did=".concat(
              driverId
            ),
            style: {
              display: "inline-block",
              padding: "10px 20px",
              margin: "0 10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
              backgroundColor: "#E2B442",
              color: "#181818",
              textDecoration: "none",
            },
            className: "action-button accept-button",
          },
          "Reset password"
        )
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Please ignore this email if this request was not initiated by you."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
          },
        },
        "Best regards,"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "The ShuttleLane Team"
      )
    ),
    /*#__PURE__*/ React.createElement(EmailFooter, null)
  );
};
export default DriverResetPasswordEmailTemplate;
