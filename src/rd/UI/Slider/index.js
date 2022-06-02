import styled from "@emotion/styled";
import React from "react";

export default class Slider extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            value: '',
            callback: props.callback
        };


        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) 
    {
        this.setState({value: event.target.value});
        this.state.callback(this.state.value);
    }

    render()
    {
        return <input type="range" min="1" max="4" defaultValue="2" step="0.1" onChange={this.handleChange}/>
    }
}