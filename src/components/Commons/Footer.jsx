import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#001f3d",
        color: "white",
        textAlign: "center",
        padding: "10px 0",
        position: "fixed",
        bottom: 0,
        width: "100%",
        fontSize: "14px",
        left: 0,
        right: 0,
      }}
    >
      <p style={{ margin: 0 }}>
        Todos los derechos reservados &copy; 2024 - Flatfinder
      </p>
    </footer>
  );
};

export default Footer;
