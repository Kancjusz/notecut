import React from "react";
import { Component } from "react";
import Shortcut from "./Shortcut";
import "../CSS/folderContentsStyle.css"

class FolderContents extends Component
{
    constructor(props)
    {
        super(props)

        this.state={
            pageId:0,
            
        }

        this.pageLeft = this.pageLeft.bind(this);
        this.pageRight = this.pageRight.bind(this);

    }

    pageLeft()
    {
        if(this.state.pageId == 0) return;

        this.setState({pageId:this.state.pageId-1})
    }

    pageRight()
    {
        if(this.state.pageId == Math.ceil(this.props.shortcuts.length / 4)) return;

        this.setState({pageId:this.state.pageId+1})
    }

    render()
    {
        let pages = new Array(Math.ceil(this.props.shortcuts.length / 4));
        for(let i = 0; i < Math.ceil(this.props.shortcuts.length / 4); i++)
        {
            pages[i] = [this.props.shortcuts[i*4],this.props.shortcuts[i*4+1],this.props.shortcuts[i*4+2],this.props.shortcuts[i*4+3]];
            pages[i] = pages[i].map((sc)=>{
                if(!sc) return;
                return (<Shortcut
                key={sc.id} 
                id={sc.id} 
                name={sc.name} 
                link={sc.link} 
                note={sc.note}
                color={sc.color}
                setDropShortcutId={()=>this.props.setDropShortcutId(true,sc.id)}
                height={this.props.height}
                width={this.props.width}
                isGrabbed={(e)=>this.props.isGrabbed(e)}
                inFolder={true}
                />);
            });
        }

        return(
            <div className={"folder" + (this.props.toLeft ? " toLeft" : "") + (this.props.toTop ? " toTop" : "")} style={{display:"flex", width:276+"px"}}>
                <div className={"arrow"+(this.state.pageId == 0 ? "NoHover": "")} onClick={this.pageLeft}><p>{this.state.pageId != 0 ? "<" : ""}</p></div>
                <div className="folderContents">
                    {pages[this.state.pageId]}
                </div>
                <div 
                className={
                    "arrow"+(this.state.pageId == pages.length-1 || pages.length == 0 ? "NoHover": "")
                } onClick={this.pageRight}><p>{this.state.pageId != pages.length-1 && pages.length != 0 ? ">" : ""}</p></div>
            </div>
        )
    }
}

export default FolderContents;