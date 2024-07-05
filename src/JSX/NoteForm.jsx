import React, { createRef } from "react";
import { Component } from "react";
import {checkIfEmptyString} from "../Scripts/validation.js"
import "../CSS/shortcutFormStyle.css"

class NoteForm extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            name: this.props.note.name,
            color: this.props.note.color,
            note: this.props.note.note,

            validationName: true,
        }

        this.form = createRef();
    }

    componentDidMount()
    {
        if(this.props.note.id !== -1) this.setState({
            validationName:false
        })
    }

    render()
    {

        return(
            <form ref={this.form}>
                <label>Title</label><br/>
                <input defaultValue={this.props.note.name} onChange={(e)=>{
                    this.setState({name:e.target.value});
                    this.setState({validationName: checkIfEmptyString(e.target)}); 
                }}/><br/>

                <label>Contents</label><br/>
                <textarea defaultValue={this.props.note.note} onChange={(e)=>{
                    this.setState({note:e.target.value});
                }} style={{whiteSpace: "pre-wrap"}}></textarea><br/>

                <label>Color</label><br/>
                <input type="color" defaultValue={this.props.note.color} onChange={(e)=>{
                    this.setState({color:e.target.value});
                }}/><br/>

                <div className="buttons">
                    <button disabled={this.state.validationName} onClick={
                        (e)=>{
                            e.preventDefault();
                            if(this.props.note.id === -1)
                                this.props.addNote(this.state.name,this.state.note,this.state.color);
                            else
                                this.props.editNote(this.state.name,this.state.note,this.state.color);
                        }
                    }>Create Note</button>
                    <button onClick={this.props.cancel}>Cancel</button>
                </div>
            </form>
        )
    }
}

export default NoteForm;