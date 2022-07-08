import React from "react";
import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

import { get } from "lodash";

// eslint-disable-next-line
const hex2rgb = (hex) => {
  return {
    r: parseInt(hex[1] + hex[2], 16),
    g: parseInt(hex[3] + hex[4], 16),
    b: parseInt(hex[5] + hex[6], 16),
  };
};

// eslint-disable-next-line
const rgb2hex = (rgb) => {
  const f = (n) => n.toString(16).padStart(2, "0");
  return `#${f(rgb.r)}${f(rgb.g)}${f(rgb.b)}`;
};

const ColorInput = (props) => {
  const [color, setColor] = useState(get(props, "default", "#ffffff"));
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    props.onChangeValue(color);
  }, [color]);

  return (
    <div style={{display:"inline-block"}}>
      <button
        style={{
          backgroundColor: color,
          width: "30px",
          height: "20px",
          margin: " 0 5px",
        }}
        onClick={() => setPicking(!picking)}
      />
      <div style={{ display: picking ? "inline" : "none", position:'absolute'}}>
        <SketchPicker
          disableAlpha
          color={color}
          onChange={(val) => {
            setColor(val.hex);
          }}
        />
      </div>
    </div>
  );
};

export { ColorInput };
