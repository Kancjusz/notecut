import React, { createRef, useState } from "react";
import { Component } from "react";
import {checkIfEmptyString} from "../Scripts/validation.js"
import ColorPicker from 'react-best-gradient-color-picker'
import "../CSS/shortcutFormStyle.css"

const ColorPopup = (props) =>{
    const [showColor, setShowColor] = useState(false);

    return(
        <div>
            <div onClick={()=>setShowColor(!showColor)} className="colorPicker" style={{
                width:80+"%",backgroundColor:"whitesmoke", opacity:1, padding:5+"px", position:"relative",
                left:""
            }}>
                <div style={{
                    height:20+"px", width:100+"%", background:props.colorState
                }}>     
                </div>
            </div>
            {showColor && <div className="colorPopup"><ColorPicker value={props.colorState} onChange={props.colorStateChange}/></div>}
        </div>
    );
}

class Settings extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            headerColor: this.props.headerColor,
            contentColor: this.props.contentColor,
            tilesColor: this.props.tilesColor,
            borderColor: this.props.borderColor,
            animate:this.props.animate,

            showHeaderColor:false,
        }

        this.form = createRef();
    }

    componentDidMount()
    {
        if(this.form.current !== null)
        {
            setTimeout(()=>this.form.current.classList.add("middle"),10); 
        }
    }

    render()
    {

        return(
            <form ref={this.form}>

                <label>Header Color</label><br/>
                <ColorPopup colorState={this.state.headerColor} colorStateChange={(e)=>{
                    this.setState({headerColor:e});
                }}/><br/>

                <label>Content Color</label><br/>
                <ColorPopup colorState={this.state.contentColor} colorStateChange={(e)=>{
                    this.setState({contentColor:e});
                }}/><br/>

                <label>Tiles Color</label><br/>
                <ColorPopup colorState={this.state.tilesColor} colorStateChange={(e)=>{
                    this.setState({tilesColor:e});
                }}/><br/>

                <label>Border Animation</label><br/>
                <input type="checkbox" defaultChecked={this.state.animate} onChange={(e)=>{
                    this.setState({animate:e.target.checked});
                }}/><br/>

                <label>Border Color</label><br/>
                <ColorPopup colorState={this.state.borderColor} colorStateChange={(e)=>{
                    this.setState({borderColor:e});
                }}/><br/>

                <div className="buttons">
                    <button disabled={this.state.validationName} onClick={
                        (e)=>{
                            e.preventDefault();
                            this.props.saveSettings(
                                this.state.headerColor, this.state.contentColor, 
                                this.state.tilesColor, this.state.borderColor, this.state.animate
                            );
                        }
                    }>Save Settings</button>
                    <button onClick={this.props.cancel}>Cancel</button>
                </div>
            </form>
        )
    }
}

export default Settings;