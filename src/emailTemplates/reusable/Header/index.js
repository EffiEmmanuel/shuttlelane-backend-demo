import React from "react";

// Header component
const Header = _ref => {
  let {
    title
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: "header",
    style: {
      textAlign: "center",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#333"
    }
  }, title));
};
export default Header;