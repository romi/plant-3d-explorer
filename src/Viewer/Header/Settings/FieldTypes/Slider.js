import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";

import "./Slider.css";

const Slider = (props) => {
  const [value, setValue] = useState(parseFloat(props.default));
  const onValueChanged = (value) => isFinite(value) ? setValue(value) : setValue(props.default)
  
  useEffect(() => {
    props.registerMenuElement({
      path: props.path, 
      defaultValue: props.default,
      needsUpdate: false,
      valueSetter: onValueChanged,
      value: props.default
    })
  }, [])

  useEffect(() => {
    props.onSettingChanged({path:props.path, value:value})
  }, [value])

  useEffect(() => {
    setValue(parseFloat(props.lastSettings))
  }, [props.lastSettings])
  
  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <ReactSlider
        step={props.step ? props.step : 0.01}
        min={props.min ? props.min : 0}
        max={props.max ? props.max : 0.99}
        value={value}
        onChange={(v) => setValue(v)}
        className="customSlider"
        thumbClassName="customSlider-thumb"
        trackClassName="customSlider-track"
        markClassName="customSlider-mark"
      />
      <div className="label">{(parseFloat(value) * 100).toFixed(1) + "%"}</div>
    </div>
  );
};

export { Slider };
