import React, { Component } from "react";
import "../CSS/shortcutStyle.css"
import EditShortcut from "./EditShortcut";
class Shortcut extends Component{
    constructor(props)
    {
        super(props)

        this.state={
            xPos:window.innerWidth/2,
            yPos:window.innerHeight/2,
            isOver:false,
            mouseDown:false,
            isClick:false,

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
    }

    componentDidMount()
    {
        document.addEventListener("mousemove",this.onMouseMove);
        document.addEventListener("mousedown",this.onMouseDown);
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove",this.onMouseMove);
        document.addEventListener("mousedown",this.onMouseDown);
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
        let outside = this.state.yPos < tilesOffset.top || this.state.yPos > window.innerHeight-tilesOffset.bottom
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
                    if(e.button === 2) return;
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
                    if(outside)
                        e.preventDefault();
                }}

                onContextMenu={(e)=>{
                    e.preventDefault();

                    let showEdit = this.state.showEdit;
                    let offset = this.getTilesWindowOffset();
                    let mousePos = {x:e.pageX-offset.left,y:e.pageY-offset.top};
                    
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
                <p>{this.props.name.length > 10 ? this.props.name.substring(0,10)+"..." : this.props.name}</p>

                {this.state.showEdit && <EditShortcut
                    posX={this.state.currentMousePos.x}
                    posY={this.state.currentMousePos.y}
                    color={this.props.color}
                />}
            </a>
        )
    }
}

export default Shortcut;