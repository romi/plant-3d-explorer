import React from "react";

export default class Slider extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            value: 1,
            callback: props.callback,
            min : props.min && props.min > 0 ? props.min : 1,
            max : props.min && props.max > 0 ? props.max : 1,
            default : props.default && props.default > 0 ? props.default : 1,
            step : props.step && props.step !== 0 ? props.step : 1
        };


        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) 
    {
        this.setState({value: event.target.value});
        this.state.callback(event.target.value);
    }

    render()
    {
        return <input 
            type="range" 
            min={this.state.min} 
            max={this.state.max} 
            defaultValue={this.state.default} 
            step={this.state.step} 
            onChange={this.handleChange}/>
    }
}