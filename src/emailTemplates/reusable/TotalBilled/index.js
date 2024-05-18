import React from "react";
const TotalBilledSection = _ref => {
  let {
    totalBilled
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "20px",
      padding: "10px 0",
      borderTop: "1px solid #ddd"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#333",
      margin: 0,
      fontWeight: "bold"
    }
  }, "Total Billed:"), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#333",
      margin: 0,
      fontWeight: "bold"
    }
  }, totalBilled));
};
export default TotalBilledSection;