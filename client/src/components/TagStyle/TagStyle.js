import React from "react";

const TagStyle = ({ color, text, size }) => {
  return (
    <>
      <div className="relative inline-block mb-3">
        <div className="absolute inset-0 bg-[#FFB71C80] transform -rotate-3 z-0 "></div>
        <span
          className="relative z-10 px-3 py-1 block font-semibold"
          style={{ color: color, fontSize: size }} 
        >
          {text}
        </span>
      </div>
    </>
  );
};

export default TagStyle;