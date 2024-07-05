import React, { Component, createRef } from "react";
import "../CSS/shortcutStyle.css"
import EditShortcut from "./EditShortcut";
class Shortcut extends Component{
    constructor(props)
    {
        super(props)

        this.state={
            xPos:window.innerWidth/2,
            yPos:document.body.scrollHeight/2,
            isOver:false,
            mouseDown:false,
            isClick:false,
            ogName:this.props.name,
            newName:this.props.name,

            showEdit:false,
            currentMousePos:{
                x:0,
                y:0
            },

            tempPos:{
                x:window.innerWidth/2,
                y:document.body.scrollHeight/2,
            }
        }

        this.setPosition = this.setPosition.bind(this);
        this.setIsOver = this.setIsOver.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onResize = this.onResize.bind(this);
        this.getTilesWindowOffset = this.getTilesWindowOffset.bind(this);

        this.name = createRef();
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

    onMouseMove(e)
    {
        let mouse = {pageX:e.pageX, pageY:e.pageY};
        this.setState({isClick:false})
        if(!this.state.mouseDown) return;
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

    onMouseDown(e)
    {
        if(e.button != 2) this.setState({showEdit:false});
        else if(this.state.showEdit) this.setState({showEdit:false});
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
        window.addEventListener("resize",this.onResize);
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove",this.onMouseDown);
        document.removeEventListener("mousedown",this.onMouseDown);
        window.removeEventListener("resize",this.onResize);
    }

    componentDidUpdate()
    {
        if(this.state.ogName !== this.props.name) this.setState({ogName:this.props.name, newName:this.props.name});
        if(this.name.current === null) return;
        if((this.name.current.scrollWidth > (this.props.width*0.85)) && this.name.current.scrollWidth > this.name.current.clientWidth)
        {
            this.setState({newName:this.name.current.innerText.substring(0,this.name.current.innerText.length-4) + "..."});
        }
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

    render()
    {

        const icon = "https://www.google.com/s2/favicons?sz=64&domain_url="+this.props.link;
        let link = (this.props.link.substr(0,8) === "https://" || this.props.link.substr(0,7) === "http://") 
        ? this.props.link : "https://"+this.props.link;

        let tilesOffset = this.getTilesWindowOffset();
        let outside = this.state.yPos < tilesOffset.top || this.state.yPos > document.body.scrollHeight-tilesOffset.bottom
                        || this.state.xPos < tilesOffset.left || this.state.xPos > window.innerWidth-tilesOffset.left;
        let descriptionTab = this.props.note.split(" ");
        let description = "";
        for(let i = 0; i < descriptionTab.length;i++)
        {
            description += descriptionTab[i] + " ";
            if(i % 5 == 0 && i != 0)
            {
                description += "\n";
            }
        }

        return(
            <a title={this.props.name + (this.props.note.length > 0 ? "\n\nopis:\n" + description : "")}
                onDragStart={(e)=>{e.preventDefault();}}
                onMouseOver={()=>this.setIsOver(true)}
                onMouseOut={()=>this.setIsOver(false)}
                onMouseDown={(e)=>{
                    if(e.button === 2 || this.state.showEdit) return;
                    this.setState({isClick:true})
                    if(e.detail == 2) return;
                    if(this.state.isOver)
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
                        });
                        this.props.isGrabbed(false);
                        return;
                    }

                    if(this.state.mouseDown)
                    {
                        if(outside)
                            this.props.setDropShortcutId(true);
                        else
                            this.props.setDropShortcutId(false);
                    }

                    this.props.isGrabbed(false);
                    this.setState({mouseDown:false});
                }}
                onClick={(e)=>{
                    if(this.state.showEdit) return;
                    if(outside)
                        e.preventDefault();
                }}

                onContextMenu={(e)=>{
                    e.preventDefault();

                    let showEdit = this.state.showEdit;
                    let offset = this.getTilesWindowOffset();

                    let mousePos = {x:e.pageX-offset.left,y:e.pageY-offset.top};
                    if(this.props.inFolder)
                    {
                        let offsetTop = e.currentTarget.offsetTop;
                        let offsetLeft = e.currentTarget.offsetLeft;

                        mousePos = {x: mousePos.x-offsetLeft, y: mousePos.y - offsetTop};
                    }
                    
                    this.setState({showEdit:!showEdit, currentMousePos:mousePos});
                }}

                href={link}
                target="_blank" className="shortcut"
                style={
                    this.state.mouseDown
                    ? {
                        backgroundColor:this.props.color, 
                        height:this.props.height, 
                        width:this.props.width, position:"absolute", 
                        top:(this.state.yPos ) - tilesOffset.top + "px", 
                        left:(this.state.xPos )- tilesOffset.left + "px", 
                        transform:"translate(-50%,-50%)" ,zIndex:5} 
                    : this.props.inFolder 
                    ? {
                        backgroundColor:this.props.color,
                        height:this.props.height+"px", 
                        width:this.props.width+"px", top:0+"%", left:0+"%", 
                        transform:"translate(0,0)"}  
                    :{backgroundColor:this.props.color,height:this.props.height, width:this.props.width,zIndex:5}
                }
            >

                <img src={icon}/>
                <p ref={this.name}>{this.state.newName} </p>

                {this.state.showEdit && <EditShortcut
                    posX={this.state.currentMousePos.x}
                    posY={this.state.currentMousePos.y}
                    color={this.props.color}
                    setEditData={()=>this.props.setEditData(this.props.id,true)}
                />}
            </a>
        )
    }
}

export default Shortcut;