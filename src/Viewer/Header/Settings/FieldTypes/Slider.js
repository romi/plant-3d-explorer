import React from "react";
import { useState } from "react";

const Slider = (props) => {
  const [value, setValue] = useState(props.default || "0.75");

  return (
    <div style={{  display: "flex", flexDirection:'row', alignItems:'center'}}>
      <input
        style={{
            display:'inline-block'
        }}
        type="range"
        min={1e-5}
        max={1}
        value={value}
        step={1e-2}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <div style={{display:'inline-block', height:'100%'}}>{parseFloat(value).toFixed(2)*100 + '%'}</div>
    </div>
  );
};

export { Slider };