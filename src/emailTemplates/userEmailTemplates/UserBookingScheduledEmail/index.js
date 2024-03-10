import React from "react";
const UserBookingScheduledConfirmation = _ref => {
  let {
    bookingReference,
    pickupLocation,
    pickupDate,
    pickupTime,
    driverName,
    driverMobile,
    carName,
    carType,
    carModel,
    carColor,
    carPlateNumber
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
  }, "Booking Confirmed: ", bookingReference), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Dear User,"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "We're pleased to inform you that your booking has been confirmed with the following details:"), /*#__PURE__*/React.createElement("ul", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Booking ID:"), " ", bookingReference), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Pickup Location:"), " ", pickupLocation), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Pickup Date:"), " ", pickupDate), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Pickup Time:"), " ", pickupTime), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Driver Name:"), " ", driverName), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Driver Contact:"), " ", driverMobile), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Car Type:"), " ", carType), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Car Name:"), " ", carName), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Car Model:"), " ", carModel), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Car Color:"), " ", carColor), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Car Plate Number:"), " ", carPlateNumber)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "Your booking is now scheduled as per the provided details. Should you have any questions or require further assistance, feel free to contact us."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333"
    }
  }, "Thank you for choosing ShuttleLane for your transportation needs."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333"
    }
  }, "Best regards,"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#333",
      marginBottom: "20px"
    }
  }, "The ShuttleLane Team")));
};
export default UserBookingScheduledConfirmation;