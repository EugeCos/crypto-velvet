import React from "react";
import PropTypes from "prop-types";
import "./TextFieldGroup.less";
import classnames from "classnames";

const TextFieldGroup = ({
  name,
  placeholder,
  type,
  value,
  error,
  info,
  handleChange,
  customWidth
}) => {
  return (
    <div
      className={classnames(
        "custom-textField-group",
        {
          "is-invalid": error
        },
        { "is-info": info }
      )}
    >
      {info && (
        <div className="info-input-container">
          <small className="info-input-message">{info}</small>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        name={name}
        style={{ width: customWidth }}
      />

      {error && (
        <div className="error-input-container">
          <small className="error-input-message">{error}</small>
        </div>
      )}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  inf: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  customWidth: PropTypes.number
};

export default TextFieldGroup;
