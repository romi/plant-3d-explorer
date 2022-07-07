import React from 'react';
import { useState } from 'react';
import { SketchPicker } from 'react-color';

import get from 'lodash';

const hex2rgb = (hex) => {
    return { r: parseInt(hex[1] + hex[2], 16),
      g: parseInt(hex[3] + hex[4], 16),
      b: parseInt(hex[5] + hex[6], 16) }
}

const rgb2hex = (rgb) => {
    const f = (n) => n.toString(16).padStart(2, '0')
    return `#${f(rgb.r)}${f(rgb.g)}${f(rgb.b)}`
} 

const ColorInput = props => {
    const [color, setColor] = useState(get(props, 'default', '#ffffff'));
    const [picking, setPicking] = useState(false);
    return <div>
        <label>Color :
            <button style={{
                backgroundColor: color,
            }} onClick={() => setPicking(!picking)} />
            <div style={{ display: picking ? 'inherit' : 'none' }}>
                <SketchPicker 
                    color ={color}  
                    onChange = {(val) => {
                        console.log(val.hex)
                        setColor(val.hex)
                    }}

                />

            </div>
        </label>
    </div>
}

export { ColorInput }