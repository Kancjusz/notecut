import React, { Component } from "react";
import "../CSS/shortcutStyle.css";
import folderImg from "../img/folder.png";
import FolderContents from "./FolderContents";
import { createRef } from "react";
import EditShortcut from "./EditShortcut";
class Folder extends Component{
    constructor(props)
    {
        super(props)

        this.state={
            xPos:window.innerWidth/2,
            yPos:window.innerHeight/2,
            isOver:false,
            mouseDown:false,
            showContents:false,
            isClick:false,

            isScrollHeight:false,
            isScrollWidth:false,

            showEdit:false,
            currentMousePos:{
                x:0,
                y:0
            },

            tempPos:{
                x:window.innerWidth/2,
                y:window.innerHeight/2,
            }
        }

        this.setPosition = this.setPosition.bind(this);
        this.setIsOver = this.setIsOver.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.getTilesWindowOffset = this.getTilesWindowOffset.bind(this);

        this.folder = createRef();
    }

    setIsOver(val)
    {
        this.setState({
            isOver:val
        });
    }

    setPosition(e)
    {
        this.setState({
            tempPos:{
                x:this.state.xPos,
                y:this.state.yPos
            },
            xPos:e.pageX,
            yPos:e.pageY
        });
    }

    getTilesWindowOffset()
    {
        let tilesWindow = document.getElementById("tiles");
        if(tilesWindow === null)
            return{
                left: 384,
                right: 384,
                top: 576,
                bottom: 576
            }
        let bodyRect = document.body.getBoundingClientRect();
        let tilesRect = tilesWindow.getBoundingClientRect();
        return{
            left: tilesRect.left - bodyRect.left,
            right: bodyRect.right - tilesRect.right,
            top: tilesRect.top - bodyRect.top,
            bottom: bodyRect.bottom - tilesRect.bottom
        }
    }

    onMouseMove(e)
    {
        this.setState({isClick:false})
        if(this.state.mouseDown && (e.pageX + this.props.width/2 < window.innerWidth) 
            && (e.pageX - this.props.width/2 > 0) 
            && (e.pageY + this.props.height/2 < document.body.scrollHeight) 
            && (e.pageY - this.props.height/2 > window.innerHeight*0.2))
            this.setPosition(e);
    }

    onMouseDown(e)
    {
        if(e.button != 2) this.setState({showEdit:false});
        else if(this.state.showEdit) this.setState({showEdit:false});

        let isWidth;
        let isHeight;

        var leftOffset = this.props.offset.left;
        var topOffset = this.props.offset.top+ (this.state.isScrollHeight ? (226-this.props.height) : 0);
        if(this.folder.current !== null)
        {
            isWidth = leftOffset + 276 > window.innerWidth;
            isHeight = topOffset + 226 > window.innerHeight;
            this.setState({isScrollHeight: isHeight, isScrollWidth: isWidth});
        }

        if(!this.state.showContents) return;
        let folder = document.getElementsByClassName("folder")[0];
        if(folder === undefined) return;

        let checkHeight = false;
        let checkWidth = false;

        if(!isHeight)
            checkHeight = e.pageY < topOffset || e.pageY > topOffset + folder.offsetHeight; 
        else
            checkHeight = e.pageY < topOffset - folder.offsetHeight + this.folder.current.offsetHeight || e.pageY > topOffset + this.folder.current.offsetHeight;

        if(!isWidth)
            checkWidth = e.pageX < leftOffset || e.pageX > leftOffset + folder.offsetWidth;
        else
            checkWidth = e.pageX < leftOffset - folder.offsetWidth + this.folder.current.offsetWidth || e.pageX > leftOffset + this.folder.current.offsetWidth;
        
        if(checkHeight || checkWidth)
            this.setState({showContents:false});
    }

    componentDidMount()
    {
        document.addEventListener("mousemove",this.onMouseMove);
        document.addEventListener("mousedown",this.onMouseDown);
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove",this.onMouseDown);
        document.removeEventListener("mousedown",this.onMouseDown);
    }

    render()
    {
        let descriptionTab = this.props.note.split(" ");
        let description = "";
        let tilesOffset = this.getTilesWindowOffset();
        let outside = this.state.yPos < tilesOffset.top || this.state.yPos > window.innerHeight-tilesOffset.bottom
                        || this.state.xPos < tilesOffset.left || this.state.xPos > window.innerWidth-tilesOffset.left;

        for(let i = 0; i < descriptionTab.length;i++)
        {
            description += descriptionTab[i] + " ";
            if(i % 5 == 0 && i != 0)
            {
                description += "\n";
            }
        }

        return(
            <div className="shortcut" ref={this.folder} title={this.props.name + (this.props.note.length > 0 ? "\n\nopis:\n" + description : "")}
                onDragStart={(e)=>{e.preventDefault();}}
                onMouseEnter={this.props.changeTile}
                onMouseOver={()=>this.setIsOver(true)}
                onMouseOut={()=>this.setIsOver(false)}
                onMouseDown={(e)=>{
                    if(e.button === 2 || this.state.showEdit) return;
                    this.setState({isClick:true, showEdit:false});
                    if(this.state.isOver && !this.state.showContents)
                    {
                        this.setPosition(e)
                        this.props.isGrabbed(true);
                        this.setState({mouseDown:true});
                    }
                }}
                onMouseUp={()=>{
                    if(this.state.isClick)
                    {
                        this.setState({
                            mouseDown:false,
                            isClick:false,
                            showContents:true,
                        });
                        this.props.isGrabbed(false);
                        return;
                    }

                    if(this.state.mouseDown)
                    {
                        if(outside)
                            this.props.setDropShortcutId(false,undefined,true);
                        else
                            this.props.setDropShortcutId(false,undefined,false);
                    }
                    this.props.isGrabbed(false);
                    this.setState({mouseDown:false});
                }}
                
                onContextMenu={(e)=>{
                    e.preventDefault();

                    if(this.state.showContents) return;

                    let showEdit = this.state.showEdit;
                    let offset = this.getTilesWindowOffset();
                    let mousePos = {x:e.pageX-offset.left,y:e.pageY-offset.top};
                    
                    this.setState({showEdit:!showEdit, currentMousePos:mousePos});
                }}

                style={
                    this.state.mouseDown
                    ? {
                        backgroundColor:this.state.showContents ? "transparent" : this.props.color, height:this.props.height, width:this.props.width, position:"absolute", 
                        top:(this.state.yPos ) - tilesOffset.top+"px", left:(this.state.xPos )- tilesOffset.left+"px", transform:"translate(-50%,-50%)"
                    } 
                    : {
                        backgroundColor:this.state.showContents ? "transparent" : this.props.color, height:this.props.height, width:this.props.width, 
                        transition: "background-color 0.5s"
                    }
                }
            >
                {this.state.showContents && <FolderContents
                    shortcuts={this.props.shortcuts}
                    setDropShortcutId={(inFolder,id,autoChangeTile)=>{this.props.setDropShortcutId(inFolder,id,autoChangeTile); this.setState({showContents:false})}}
                    height={this.props.height}
                    width={this.props.width}
                    offset={this.props.offset}
                    color={this.props.color}
                    isGrabbed={(e)=>this.props.isGrabbed(e)}
                    toLeft={this.state.isScrollWidth}
                    toTop={this.state.isScrollHeight}
                    setEditData={this.props.setEditData}
                />}

                {!this.state.showContents && <img src={folderImg}/>}
                {!this.state.showContents && <p>{this.props.name.length > 10 ? this.props.name.substring(0,10)+"..." : this.props.name} </p>}
                
                {this.state.showEdit && <EditShortcut
                    posX={this.state.currentMousePos.x}
                    posY={this.state.currentMousePos.y}
                    color={this.props.color}
                    setEditData={()=>this.props.setEditData(this.props.id,false)}
                />}
            </div>
        )
    }
}

export default Folder;