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
        if(this.form.current !== null)
        {
            setTimeout(()=>this.form.current.classList.add("middle"),10); 
        }
    }

    render()
    {
        return(
            <form ref={this.form}>
                <label>Nazwa</label><br/>
                <input onChange={(e)=>{
                    this.setState({name:e.target.value});
                    this.setState({validationName: checkIfEmptyString(e.target)}); 
                }}/><br/>

                <label>Link</label><br/>
                <input onChange={(e)=>{
                    this.setState({link:e.target.value});
                    this.setState({validationLink: checkIfEmptyString(e.target)}); 
                }}/><br/>

                <label>Opis</label><br/>
                <textarea onChange={(e)=>{
                    this.setState({note:e.target.value});
                }}></textarea><br/>

                <label>Kolor</label><br/>
                <input type="color" onChange={(e)=>{
                    this.setState({color:e.target.value});
                }}/><br/>

                <button disabled={this.state.validationName || this.state.validationLink} onClick={
                    (e)=>{
                        e.preventDefault();
                        this.props.addShortcut(this.state.name,this.state.link,this.state.note,this.state.color);
                    }
                }>Utwórz Skrót</button>
                <button onClick={this.props.cancel}>Anuluj</button>
            </form>
        )
    }
}

export default ShortcutForm;