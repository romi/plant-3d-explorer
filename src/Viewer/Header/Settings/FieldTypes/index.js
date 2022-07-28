// import { TextInput } from './TextInput';
import { ColorInput } from './ColorInput';
import { Slider } from './Slider';

function typeReducer(type)
{
    switch (type) {
        // case 'text':
        //     return TextInput;
        case 'colorpicker':
            return ColorInput;
        case 'slider':
            return Slider;
        default:
            return null;
    }

}

export { typeReducer }