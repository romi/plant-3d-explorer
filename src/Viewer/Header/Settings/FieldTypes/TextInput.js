import React from "react";

const TextInput = ({ defaultValue, outerStyle }) => {
  return (
    <div style={{
      ...outerStyle,
      padding:"25px"
    }}>
      <label>
        {"Label"}
        <input type="text" value={defaultValue} />
      </label>
    </div>
  );
};

export { TextInput };
