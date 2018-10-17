import React from "react";

export default function ButtonAction(props) {
  const { callback, name, additionalStyle } = props;
  return (
    <button
      onClick={callback}
      className={`action-button ${additionalStyle ? additionalStyle : ""}`}
    >
      {name}
    </button>
  );
}
