import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import { omit } from "lodash";

import { isEqual } from "lodash";

import "./Slider.css";

const Slider = (props) => {
  const [value, setValue] = useState(parseFloat(props.default));
  useEffect(() => {
    if (props.settingsShouldReset) setValue(parseFloat(props.default));
  }, [props.reset]);

  useEffect(() => {
    if (props.settingsShouldRestore) setValue(parseFloat(props.lastSettings));
  }, [props.restore]);

  useEffect(() => {
    console.log(
      "Value is " + value + " and lastValue is " + props.lastSettings
    );
    if (
      !isEqual(parseFloat(props.lastValue), value) &&
      props.confirm.settingsShouldConfirm
    ) {
      props.onChangeSettings({
        path: props.path,
        value: value,
      });
    }
  }, [props.confirm.settingsShouldConfirm]);

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
