import React from "react";
import "./TextFieldGroup.less";

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
    <div className="custom-textField-group">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        name={name}
      />
    </div>
  );
};

export default TextFieldGroup;
