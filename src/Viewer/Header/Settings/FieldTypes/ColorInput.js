import React from "react";
import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

import { isEqual } from "lodash";

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
  const [color, setColor] = useState(props.default);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if(props.reset)
      setColor(props.default)
  }, [props.reset]);

  useEffect(() => {
    if(props.restore)
      setColor(props.lastSettings)
  }, [props.restore])

  useEffect(() => {
    if(!(isEqual(props.lastValue, color)) && props.confirm.settingsShouldConfirm)
    {
      props.onChangeSettings({
        path: props.path,
        value: color
      })
    }
  }, [props.confirm.settingsShouldConfirm])

  useEffect(() => setColor(props.lastSettings), [props.lastSettings])

  return (
    <div style={{display:"inline-block"}}>
      <button
        style={{
          backgroundColor: color,
          width: "30px",
          height: "20px",
          margin: "0px 5px",
        }}
        onClick={() => setPicking(!picking)}
      />
      <div style={{ display: picking ? "inline" : "none", position:'absolute', zIndex:10002 }}>
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
