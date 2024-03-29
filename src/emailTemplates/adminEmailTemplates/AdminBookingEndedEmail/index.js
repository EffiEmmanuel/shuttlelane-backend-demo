import React from "react";
import BookingDetails from "../../reusable/BookingDetails/index.js";
const AdminBookingEndedEmailTemplate = (_ref) => {
  let { bookingReference, isVendor, vendor, driver, bookingRate } = _ref;
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
        "Trip Ended: ",
        bookingReference
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Dear Admin,"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "We would like to inform you that the trip for booking",
        " ",
        bookingReference,
        " has been marked as completed."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Please review the trip details and ensure all necessary follow-up actions are taken. Find below, ",
        isVendor ? "Vendor's" : "Driver's",
        " ",
        "account details:"
      ),
      isVendor
        ? /*#__PURE__*/ React.createElement(
            React.Fragment,
            null,
            /*#__PURE__*/ React.createElement(BookingDetails, {
              details: {
                "AMOUNT TO SEND:": bookingRate,
                "BANK NAME:":
                  vendor === null || vendor === void 0 ? void 0 : vendor.bank,
                "ACCOUNT NAME:":
                  vendor === null || vendor === void 0
                    ? void 0
                    : vendor.accountName,
                "ACCOUNT NUMBER:":
                  vendor === null || vendor === void 0
                    ? void 0
                    : vendor.accountNumber,
              },
            })
          )
        : /*#__PURE__*/ React.createElement(
            React.Fragment,
            null,
            /*#__PURE__*/ React.createElement(BookingDetails, {
              details: {
                "AMOUNT TO SEND:": bookingRate,
                "BANK NAME:":
                  driver === null || driver === void 0 ? void 0 : driver.bank,
                "ACCOUNT NAME:":
                  driver === null || driver === void 0
                    ? void 0
                    : driver.accountName,
                "ACCOUNT NUMBER:":
                  driver === null || driver === void 0
                    ? void 0
                    : driver.accountNumber,
              },
            })
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
    )
  );
};
export default AdminBookingEndedEmailTemplate;
