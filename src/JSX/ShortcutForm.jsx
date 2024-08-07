import React, { createRef } from "react";
import { Component } from "react";
import {checkIfEmptyString} from "../Scripts/validation.js"
import "../CSS/shortcutFormStyle.css"

class ShortcutForm extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            link: "",
            note: "",
            color:"",

            validationName: true,
            validationLink: true,
        }

        this.form = createRef();
    
    }
    

    componentDidMount()
    {

        if(this.props.shortcut.id !== -1) this.setState({
            validationName:false,
            validationLink: false,
            name: this.props.shortcut.name,
            note: this.props.shortcut.note,
            link: this.props.shortcut.link,
            color: this.props.shortcut.color
        })
    }

    render()
    {
        return(
            <form ref={this.form}>
                <label>Name</label><br/>
                <input defaultValue={this.props.shortcut.name} onChange={(e)=>{
                    this.setState({name:e.target.value});
                    this.setState({validationName: checkIfEmptyString(e.target)}); 
                }}/><br/>

                <label>Link</label><br/>
                <input defaultValue={this.props.shortcut.link} onChange={(e)=>{
                    this.setState({link:e.target.value});
                    this.setState({validationLink: checkIfEmptyString(e.target)}); 
                }}/><br/>

                <label>Description</label><br/>
                <textarea defaultValue={this.props.shortcut.note} onChange={(e)=>{
                    this.setState({note:e.target.value});
                }}></textarea><br/>

                <label>Color</label><br/>
                <input type="color" defaultValue={this.props.shortcut.color} onChange={(e)=>{
                    this.setState({color:e.target.value});
                }}/><br/>

                <div className="buttons">
                    <button disabled={this.state.validationName || this.state.validationLink} onClick={
                        (e)=>{
                            e.preventDefault();

                            if(this.props.shortcut.id === -1)
                                this.props.addShortcut(this.state.name,this.state.link,this.state.note,this.state.color);
                            else
                                this.props.editShortcut(this.state.name,this.state.link,this.state.note,this.state.color);
                        }
                    }>{this.props.shortcut.id === -1 ? "Create Shortcut" : "Edit Shortcut"}</button>
                    <button onClick={this.props.cancel}>Cancel</button>
                </div>

            </form>
        )
    }
}

export default ShortcutForm;