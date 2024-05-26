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
    "body",
    {
      style: {
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f5f5f5",
        margin: "0",
        padding: "20px",
        textAlign: "center",
      },
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        style: {
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "5px",
          textAlign: "left",
        },
      },
      /*#__PURE__*/ React.createElement("img", {
        src: "https://shuttlelane.com/static/media/logo.46684879b753af396f9a.png",
        alt: "Shuttlelane Limited",
        width: "150",
        style: {
          maxWidth: "100%",
          height: "auto",
          marginBottom: "20px",
        },
      }),
      /*#__PURE__*/ React.createElement(
        "h1",
        {
          style: {
            fontWeight: 600,
            marginTop: "20px",
            marginBottom: "10px",
            color: "#000000",
          },
        },
        "Booking Confirmation"
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            lineHeight: "1.5",
            marginBottom: "20px",
            color: "#000000",
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
            lineHeight: "1.5",
            marginBottom: "20px",
            color: "#000000",
          },
        },
        "Thank you for booking your ",
        bookingType,
        " Booking with Shuttlelane."
      ),
      /*#__PURE__*/ React.createElement(BookingDetails, {
        details: {
          ...bookingDetails,
          TOTAL: totalBilled,
        },
        endNote: "",
      }),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            lineHeight: "1.5",
            marginBottom: "20px",
            color: "#000000",
          },
        },
        "Thank you for choosing Shuttlelane. We look forward to providing you with an exceptional experience."
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          style: {
            lineHeight: "1.5",
            marginBottom: "20px",
            color: "#000000",
          },
        },
        "Best regards,",
        /*#__PURE__*/ React.createElement("br", null),
        "The Shuttlelane Team."
      )
    ),
    /*#__PURE__*/ React.createElement(EmailFooter, null)
  );
};
export default BookingSuccessfulEmail;
