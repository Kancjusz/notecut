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
            ogName:this.props.name,
            newName:this.props.name,

            isScrollHeight:false,
            isScrollWidth:false,
            inFolderBoundries:false,
            left:0,

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
        this.onShortcutDown = this.onShortcutDown.bind(this);
        this.onShortcutUp = this.onShortcutUp.bind(this);
        this.onResize = this.onResize.bind(this);
        this.getTilesWindowOffset = this.getTilesWindowOffset.bind(this);
        this.checkIfInFolderBounds = this.checkIfInFolderBounds.bind(this);   

        this.folder = createRef();
        this.name = createRef();
        this.pressTimer = createRef();
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

    onMouseMove(e1)
    {
        let e = {pageX:0, pageY:0};

        if(e1.type == 'touchmove'){   
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {pageX:e1.pageX, pageY:e1.pageY};
        }

        let mouse = {pageX:e.pageX, pageY:e.pageY};
        this.setState({isClick:false})

        let isWidth;
        let isHeight;
        let isLeft;

        var bodyRect = document.body.getBoundingClientRect();
        var elemRect = this.folder.current.getBoundingClientRect();

        var leftOffset = elemRect.left - bodyRect.left;
        var topOffset = elemRect.top - bodyRect.top+ (this.state.isScrollHeight && this.state.showContents ? (226-this.props.height) : 0);
        if(this.folder.current !== null)
        {
            isWidth = leftOffset + 276 > window.innerWidth;
            isHeight = topOffset + 226 > window.innerHeight;
            isLeft = leftOffset + this.props.width - 276 < 0 && isWidth ? -(leftOffset + this.props.width - 276) : 0;
        }

        let inBounds = this.checkIfInFolderBounds(isHeight,isWidth,topOffset,leftOffset,isLeft,e);
        this.setState({inFolderBoundries:!inBounds.checkHeight && !inBounds.checkWidth});

        if(!this.state.mouseDown) return;

        clearTimeout(this.pressTimer);

        if(e.pageX + this.props.width/2 > window.innerWidth)
            mouse.pageX = window.innerWidth - this.props.width/2;
        else if(e.pageX - this.props.width/2 < 0) 
            mouse.pageX = this.props.width/2;

        if(e.pageY + this.props.height/2 > document.body.scrollHeight) 
            mouse.pageY = document.body.scrollHeight - this.props.height/2;
        else if(e.pageY - this.props.height/2 < this.props.headerHeight)
            mouse.pageY = this.props.headerHeight + this.props.height/2;

        this.setPosition(mouse);
    }

    checkIfInFolderBounds(isHeight,isWidth,topOffset,leftOffset,isLeft,e)
    {
        let checkHeight = false;
        let checkWidth = false;

        if(!isHeight)
            checkHeight = e.pageY < topOffset || e.pageY > topOffset + 226; 
        else
            checkHeight = e.pageY < topOffset - 226 + this.props.height || e.pageY > topOffset + this.props.height;

        if(!isWidth)
            checkWidth = e.pageX < leftOffset || e.pageX > leftOffset + 276;
        else
            checkWidth = e.pageX < leftOffset - 276 + this.props.width + isLeft || e.pageX > leftOffset + this.props.width + isLeft;

        return {checkHeight:checkHeight, checkWidth:checkWidth};
    }

    onMouseDown(e1)
    {
        if(e1.button != 2 && e1.button != undefined) this.setState({showEdit:false});
        else if(this.state.showEdit) this.setState({showEdit:false})

        let e = {pageX:0, pageY:0, button:e1.button, detail:e1.detail};

        if(e1.type == 'touchstart'){   
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {...e,pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {...e,pageX:e1.pageX, pageY:e1.pageY};
        }

        let isWidth;
        let isHeight;
        let isLeft;

        var bodyRect = document.body.getBoundingClientRect();
        var elemRect = this.folder.current.getBoundingClientRect();

        var leftOffset = elemRect.left - bodyRect.left;
        var topOffset = elemRect.top - bodyRect.top+ (this.state.isScrollHeight && this.state.showContents ? (226-this.props.height) : 0);
        if(this.folder.current !== null)
        {
            isWidth = leftOffset + 276 > window.innerWidth;
            isHeight = topOffset + 226 > window.innerHeight;
            isLeft = leftOffset + this.props.width - 276 < 0 && isWidth ? -(leftOffset + this.props.width - 276) : 0;
            this.setState({isScrollHeight: isHeight, isScrollWidth: isWidth, left:isLeft});
        }

        if(!this.state.showContents) return;
        let folder = document.getElementsByClassName("folder")[0];
        if(folder === undefined) return;

        let inBounds = this.checkIfInFolderBounds(isHeight,isWidth,topOffset,leftOffset,isLeft,e);

        if(inBounds.checkHeight || inBounds.checkWidth)
            this.setState({showContents:false});

        this.setState({inFolderBoundries:!inBounds.checkHeight && !inBounds.checkWidth});
    }

    onShortcutUp(e1,outside)
    {
        let e = {pageX:0, pageY:0, button:e1.button, detail:e1.detail};

        if(e1.type == 'touchstart'){   
            this.setIsOver(false); 
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {...e,pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {...e,pageX:e1.pageX, pageY:e1.pageY};
        }

        if(this.state.isClick)
        {
            this.setState({
                mouseDown:false,
                isClick:false,
                showContents:!this.state.showEdit,
            });
            this.props.isGrabbed(false);

            clearTimeout(this.pressTimer);

            return;
        }

        if(this.state.mouseDown)
        {
            if(this.state.showEdit)
            {
                this.props.setDropShortcutId(false,undefined,true);
                this.props.isGrabbed(false);
                this.setState({mouseDown:false});
                clearTimeout(this.pressTimer);
                return;
            }

            if(outside)
                this.props.setDropShortcutId(false,undefined,true);
            else
                this.props.setDropShortcutId(false,undefined,false);

        }
        this.props.isGrabbed(false);
        this.setState({mouseDown:false});
    }

    
    onShortcutDown(e1)
    {
        let e = {pageX:0, pageY:0, button:e1.button, detail:e1.detail};
        let isOver = false;

        if(e1.type == 'touchstart'){    
            var touch = e1.touches[0] || e1.changedTouches[0];
            isOver = true;
            e = {...e,pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {...e,pageX:e1.pageX, pageY:e1.pageY};
        }

        if(e.button === 2 || this.state.showEdit) return;
        this.setState({isClick:true, showEdit:false});
        if((this.state.isOver || isOver) && !this.state.showContents)
        {
            this.setPosition(e)
            this.props.isGrabbed(true);
            this.setState({mouseDown:true});

            if(e1.type == 'touchstart') 
                this.pressTimer = window.setTimeout(() => {
                    this.props.setDropShortcutId(false,undefined,true);
                    let offset = this.getTilesWindowOffset()
                    let mousePos = {x:this.props.width/2-offset.left,y:this.props.height/2-offset.top};
                    this.setState({showEdit:true, currentMousePos:mousePos});
                },1000);     
        }
    }

    onResize()
    {
        if(this.name.current === null) return;
        this.setState({newName:this.props.name});
    }

    componentDidMount()
    {
        document.addEventListener("mousemove",this.onMouseMove);
        document.addEventListener("mousedown",this.onMouseDown);

        window.addEventListener("touchstart",this.onMouseDown, { passive: false });
        window.addEventListener("touchmove",this.onMouseMove, { passive: false });

        window.addEventListener("resize",this.onResize);
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove",this.onMouseMove);
        document.removeEventListener("mousedown",this.onMouseDown);

        window.removeEventListener("touchstart",this.onMouseDown);
        window.removeEventListener("touchmove",this.onMouseMove);

        window.removeEventListener("resize",this.onResize);
    }

    componentDidUpdate()
    {
        if(this.state.ogName !== this.props.name) this.setState({ogName:this.props.name, newName:this.props.name});
        if(this.name.current === null) return;
        if(this.name.current.scrollWidth > this.name.current.clientWidth)
        {
            this.setState({newName:this.name.current.innerText.substring(0,this.name.current.innerText.length-4) + "..."});
        }
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
                onTouchStart={this.onShortcutDown}
                onMouseDown={this.onShortcutDown}
                onTouchEnd={(e)=>{this.onShortcutUp(e,outside)}}
                onMouseUp={(e)=>{this.onShortcutUp(e,outside)}}
                
                onContextMenu={(e)=>{
                    e.preventDefault();
                    if(this.state.showContents) return;

                    let mousePos = {x:0,y:0};
                    
                    this.setState({showEdit:true, currentMousePos:mousePos});
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
                    setDropShortcutId={(inFolder,id,autoChangeTile)=>{this.props.setDropShortcutId(inFolder,id,autoChangeTile); this.setState({showContents:autoChangeTile})}}
                    height={this.props.height}
                    width={this.props.width}
                    offset={this.props.offset}
                    color={this.props.color}
                    isGrabbed={(e)=>this.props.isGrabbed(e)}
                    toLeft={this.state.isScrollWidth}
                    toTop={this.state.isScrollHeight}
                    toRight={this.state.left}
                    setEditData={this.props.setEditData}
                    inFolderBoundries={this.state.inFolderBoundries}
                />}

                {!this.state.showContents && <img src={folderImg}/>}
                {!this.state.showContents && <p ref={this.name}>{this.state.newName} </p>}
                
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