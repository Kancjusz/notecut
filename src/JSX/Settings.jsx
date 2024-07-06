import React, { createRef, useEffect, useState } from "react";
import { Component } from "react";
import {checkIfEmptyString} from "../Scripts/validation.js"
import ColorPicker from 'react-best-gradient-color-picker'
import bingLogo from "../img/bingLogo.svg"
import yahooLogo from "../img/yahooLogo.png"
import duckLogo from "../img/duckLogo.png"
import "../CSS/shortcutFormStyle.css"

const ColorPopup = (props) =>{
    const [showColor, setShowColor] = useState(props.show);

    useEffect(() => {
        setShowColor(props.show);
    }, [props])

    return(
        <div>
            <div onClick={()=>{
                props.setShow(!showColor); 
                setShowColor(!showColor);
            }} className="colorPicker" style={{
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

const SearchEnginePicker = (props) =>{
    
    return(
        <div className="enginePicker">
            <span>
                <input type="radio" className="imageRadio" name="test" value="https://www.google.com" 
                    defaultChecked={props.default === "https://www.google.com"} checked={props.default === "https://www.google.com"}
                    onChange={(e)=>props.onChange(e.target.value)}
                />
                <img src="https://www.google.com/s2/favicons?sz=64&domain_url=https://www.google.com" alt="Option 1"/>
            </span>

            <span>
                <input type="radio" className="imageRadio" name="test" value="https://www.bing.com" 
                    defaultChecked={props.default === "https://www.bing.com"} checked={props.default === "https://www.bing.com"}
                    onChange={(e)=>props.onChange(e.target.value)}
                />
                <img src={bingLogo} alt="Option 2"/>
            </span>

            <span>
                <input type="radio" className="imageRadio" name="test" value="https://search.yahoo.com" 
                    defaultChecked={props.default === "https://search.yahoo.com"} checked={props.default === "https://search.yahoo.com"}
                    onChange={(e)=>props.onChange(e.target.value)}
                />
                <img src={yahooLogo} alt="Option 2"/>
            </span>

            <span>
                <input type="radio" className="imageRadio" name="test" value="https://r.duckduckgo.com" 
                    defaultChecked={props.default === "https://r.duckduckgo.com"} checked={props.default === "https://r.duckduckgo.com"}
                    onChange={(e)=>props.onChange(e.target.value)}
                />
                <img src={duckLogo} alt="Option 2"/>
            </span>
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

            showSearchBar:this.props.showSearchBar,
            searchEngine:this.props.searchEngine,
            newTab:this.props.newTab,
            findShortcuts:this.props.findShortcuts,
            separateNotes:this.props.separateNotes,
            displayNotesOpen:this.props.displayNotesOpen,

            colorPopupsShow:{
                show1:false,
                show2:false,
                show3:false,
                show4:false
            }
        }

        this.form = createRef();
    }

    render()
    {

        return(
            <form ref={this.form}>

                <label>Header Color</label><br/>
                <ColorPopup show={this.state.colorPopupsShow.show1} setShow={(show)=>{this.setState({colorPopupsShow:{
                    show1:show,
                    show2:false,
                    show3:false,
                    show4:false
                }})}} colorState={this.state.headerColor} colorStateChange={(e)=>{
                    this.setState({headerColor:e});
                }}/><br/>

                <label>Content Color</label><br/>
                <ColorPopup show={this.state.colorPopupsShow.show2} setShow={(show)=>{this.setState({colorPopupsShow:{
                    show1:false,
                    show2:show,
                    show3:false,
                    show4:false
                }})}} colorState={this.state.contentColor} colorStateChange={(e)=>{
                    this.setState({contentColor:e});
                }}/><br/>

                <label>Tiles Color</label><br/>
                <ColorPopup show={this.state.colorPopupsShow.show3} setShow={(show)=>{this.setState({colorPopupsShow:{
                    show1:false,
                    show2:false,
                    show3:show,
                    show4:false
                }})}} colorState={this.state.tilesColor} colorStateChange={(e)=>{
                    this.setState({tilesColor:e});
                }}/><br/>

                <label>Border Animation</label><br/>
                <input type="checkbox" defaultChecked={this.state.animate} checked={this.state.animate} onChange={(e)=>{
                    this.setState({animate:e.target.checked});
                }}/><br/>

                <label>Border Color</label><br/>
                <ColorPopup show={this.state.colorPopupsShow.show4} setShow={(show)=>{this.setState({colorPopupsShow:{
                    show1:false,
                    show2:false,
                    show3:false,
                    show4:show
                }})}} colorState={this.state.borderColor} colorStateChange={(e)=>{
                    this.setState({borderColor:e});
                }}/><br/>

                <hr/><br/>

                <label>Show Search Bar</label><br/>
                <input type="checkbox" defaultChecked={this.state.showSearchBar} checked={this.state.showSearchBar} onChange={(e)=>{
                    this.setState({showSearchBar:e.target.checked});
                }}/><br/>

                {this.state.showSearchBar && <div>
                    <label>Pick Search Engine</label><br/>
                    <SearchEnginePicker default={this.state.searchEngine} onChange={(e)=>this.setState({searchEngine:e})}/>

                    <label>Open In New Tab</label><br/>
                    <input type="checkbox" defaultChecked={this.state.newTab} checked={this.state.newTab} onChange={(e)=>{
                        this.setState({newTab:e.target.checked});
                    }}/><br/>

                    <label>Search Shortcuts</label><br/>
                    <input type="checkbox" defaultChecked={this.state.findShortcuts} checked={this.state.findShortcuts} onChange={(e)=>{
                        this.setState({findShortcuts:e.target.checked});
                    }}/><br/>
                </div>}

                <hr/><br/>

                <label>Notes & Shortcuts in Separate Tabs</label><br/>
                <input type="checkbox" style={{transform:"none"}} defaultChecked={this.state.separateNotes} checked={this.state.separateNotes} onChange={(e)=>{
                    this.setState({separateNotes:e.target.checked});
                }}/><br/>

                <hr/><br/>

                <button className="defaultSettings" onClick={(e)=>{
                    e.preventDefault();
                    this.setState({
                        headerColor: "rgba(0, 0, 0, 0.404)",
                        contentColor: "grey",
                        tilesColor: "dimgrey",
                        borderColor: "linear-gradient(to right, red 4%, orange 20%, yellow 36%, green 52%, blue 68%, indigo 84%, violet 100%)",
                        animate:true,

                        showSearchBar:true,
                        searchEngine:"https://www.google.com",
                        newTab:true,
                        findShortcuts:true,
                        separateNotes:false,
                        displayNotesOpen:true,
                    });
                }}>Set to Default</button>

                <div className="buttons">
                    <button disabled={this.state.validationName} onClick={
                        (e)=>{
                            e.preventDefault();
                            this.props.saveSettings({
                                headerColor:this.state.headerColor, 
                                contentColor:this.state.contentColor, 
                                tilesColor:this.state.tilesColor, 
                                borderColor:this.state.borderColor, 
                                animate:this.state.animate,

                                showSearchBar:this.state.showSearchBar,
                                searchEngine:this.state.searchEngine,
                                newTab:this.state.newTab,
                                findShortcuts:this.state.findShortcuts,
                                separateNotes:this.state.separateNotes,
                                displayNotesOpen:this.state.displayNotesOpen,
                                displayNotes:this.props.displayNotes
                            });
                        }
                    }>Save Settings</button>
                    <button onClick={this.props.cancel}>Cancel</button>
                </div>
            </form>
        )
    }
}

export default Settings;