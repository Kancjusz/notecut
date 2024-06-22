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
        if(this.state.pageId === Math.ceil(this.props.shortcuts.length / 4)-1) return;

        this.setState({pageId:this.state.pageId+1})
    }

    render()
    {
        let tileWidth = Math.floor((window.innerWidth < 1920 * 0.5 ? window.innerWidth : 1920 * 0.5)/12);
        let tileHeight = Math.floor((window.innerHeight*0.7)/8);
        let topOffset = this.props.toTop ? 226-tileHeight : 0;
        let leftOffset = this.props.toLeft ? 276-tileWidth : 0;

        let marginAnimation = "0.5s ease-in-out 0s 1 normal forwards running folderOpen";
        marginAnimation += this.props.toTop ? ", 0.5s ease-in-out 0s 1 normal none running folderOpenMarginTop" : "";
        marginAnimation += this.props.toLeft ? ", 0.5s ease-in-out 0s 1 normal none running folderOpenMarginLeft" : "";

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
                setDropShortcutId={(autoChangeTile)=>this.props.setDropShortcutId(true,sc.id,autoChangeTile)}
                height={96}
                width={96}
                isGrabbed={(e)=>this.props.isGrabbed(e)}
                setEditData={this.props.setEditData}
                inFolder={true}
                />);
            });
        }

        return(
            <div className={"folder"} style={{
                marginTop:-topOffset+"px", marginLeft:-leftOffset+"px",
                animation: marginAnimation
            }}>
                <div className={"arrow"+(this.state.pageId == 0 ? "NoHover": "")} onClick={this.pageLeft}><p>{this.state.pageId != 0 ? "<" : ""}</p></div>
                <div className="folderContents">
                    {pages[this.state.pageId]}
                </div>
                <div 
                className={
                    "arrow"+(this.state.pageId == pages.length-1 || pages.length == 0 ? "NoHover": "")
                } onClick={this.pageRight}><p>{this.state.pageId != pages.length-1 && pages.length != 0 ? ">" : ""}</p></div>

                
                <div className="folderAnimationDiv" style={{
                    backgroundColor:this.props.color
                }}/>

                <style>
                    {`
                        @keyframes folderOpenMarginTop {
                            from {margin-top: 0;}
                            to {margin-top: ${-topOffset}px;}
                        }

                        @keyframes folderOpenMarginLeft {
                            from {margin-left: 0;}
                            to {margin-left: ${-leftOffset}px;}
                        }
                    `}
                </style>
            </div>
        )
    }
}

export default FolderContents;