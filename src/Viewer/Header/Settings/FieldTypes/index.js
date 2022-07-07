import { TextInput } from './TextInput';
import { ColorInput } from './ColorInput';

function typeReducer(type)
{
    switch (type) {
        case 'text':
            return TextInput;
        case 'colorpicker':
            return ColorInput;
        default:
            return null;
    }

}

export { typeReducer }