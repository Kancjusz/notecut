import React, { createRef } from "react";
import { Component } from "react";
import {checkIfEmptyString} from "../Scripts/validation.js"
import "../CSS/shortcutFormStyle.css"

class FolderForm extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            color: "",
            note: "",

            validationName: true,
        }

        this.form = createRef();
    }

    componentDidMount()
    {

        if(this.props.folder.id !== -1) this.setState({
            validationName:false,
            name: this.props.folder.name,
            note: this.props.folder.note,
            color: this.props.folder.color
        })
    }

    render()
    {

        return(
            <form ref={this.form}>
                <label>Name</label><br/>
                <input defaultValue={this.props.folder.name} onChange={(e)=>{
                    this.setState({name:e.target.value});
                    this.setState({validationName: checkIfEmptyString(e.target)}); 
                }}/><br/>

                <label>Description</label><br/>
                <textarea defaultValue={this.props.folder.note} onChange={(e)=>{
                    this.setState({note:e.target.value});
                }}></textarea><br/>

                <label>Color</label><br/>
                <input type="color" defaultValue={this.props.folder.color} onChange={(e)=>{
                    this.setState({color:e.target.value});
                }}/><br/>

                <div className="buttons">
                    <button disabled={this.state.validationName} onClick={
                        (e)=>{
                            e.preventDefault();
                            if(this.props.folder.id === -1)
                                this.props.addFolder(this.state.name,this.state.note,this.state.color);
                            else
                                this.props.editFolder(this.state.name,this.state.note,this.state.color);
                        }
                    }>{this.props.folder.id === -1 ? "Create Folder" : "Edit Folder"}</button>
                    <button onClick={this.props.cancel}>Cancel</button>
                </div>
            </form>
        )
    }
}

export default FolderForm;