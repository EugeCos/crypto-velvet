import React from "react";
import "./TextFieldGroup.less";
import classnames from "classnames";

const TextFieldGroup = ({
  name,
  placeholder,
  type,
  value,
  error,
  info,
  handleChange
}) => {
  return (
    <div
      className={classnames("custom-textField-group", {
        "is-invalid": error
      })}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        name={name}
      />
      {error && (
        <div className="error-input-container">
          <small className="error-input-message">{error}</small>
        </div>
      )}
    </div>
  );
};

export default TextFieldGroup;
