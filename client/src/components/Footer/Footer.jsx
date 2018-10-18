import React from "react";
import "./Footer.less";

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        designed and developed by
        <span
          className="footer-link"
          onClick={() => window.open("https://github.com/EugeCos", "_blank")}
        >
          &nbsp;Eugene Costov
        </span>
      </span>
    </footer>
  );
}
