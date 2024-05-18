import React from "react";
import EmailHeader from "../../reusable/EmailHeader/index.js";
import EmailFooter from "../../reusable/EmailFooter/index.js";
import BookingDetails from "../../reusable/BookingDetails/index.js";
import TotalBilledSection from "../../reusable/TotalBilled/index.js";
const BookingSuccessfulEmail = (_ref) => {
  var _booking$user$title, _booking$user, _booking$user$firstNa, _booking$user2;
  let { bookingReference, booking, bookingType, bookingDetails, totalBilled } =
    _ref;
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
    /*#__PURE__*/ React.createElement(EmailHeader, null),
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
        "Booking Confirmation"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "10px",
          },
        },
        "Dear ",
        (_booking$user$title =
          booking === null ||
          booking === void 0 ||
          (_booking$user = booking.user) === null ||
          _booking$user === void 0
            ? void 0
            : _booking$user.title) !== null && _booking$user$title !== void 0
          ? _booking$user$title
          : booking === null || booking === void 0
          ? void 0
          : booking.title,
        " ",
        (_booking$user$firstNa =
          booking === null ||
          booking === void 0 ||
          (_booking$user2 = booking.user) === null ||
          _booking$user2 === void 0
            ? void 0
            : _booking$user2.firstName) !== null &&
          _booking$user$firstNa !== void 0
          ? _booking$user$firstNa
          : booking === null || booking === void 0
          ? void 0
          : booking.firstName,
        ","
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Thank you for booking your ",
        bookingType,
        " with ShuttleLane."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "20px",
          },
        },
        "Your booking reference is: ",
        bookingReference
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          style: {
            backgroundColor: "green",
            color: "#fff",
            padding: "10px",
            textAlign: "center",
            borderRadius: "10px 10px 0 0",
            width: "100%",
            boxSizing: "border-box",
          },
        },
        /*#__PURE__*/ React.createElement(
          "h1",
          {
            style: {
              margin: 0,
            },
          },
          "BOOKING DETAILS"
        )
      ),
      /*#__PURE__*/ React.createElement(BookingDetails, {
        details: {
          ...bookingDetails,
        },
        endNote: "",
      }),
      /*#__PURE__*/ React.createElement(TotalBilledSection, {
        totalBilled: totalBilled,
      }),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            color: "#333",
            marginBottom: "10px",
          },
        },
        "Thank you for choosing our service!"
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
        "The Shuttlelane Booking Team."
      )
    ),
    /*#__PURE__*/ React.createElement(EmailFooter, null)
  );
};
export default BookingSuccessfulEmail;
