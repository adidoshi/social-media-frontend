import React from "react";

const TextError = (props) => {
  // register/ login form, formik error message
  return <div className="errorMsg">{props.children}</div>;
};

export default TextError;
