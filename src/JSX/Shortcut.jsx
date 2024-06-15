import React, { Component } from "react";
import "../CSS/shortcutStyle.css"
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

            tempPos:{
                x:window.innerWidth/2,
                y:window.innerHeight/2,
            }
        }

        this.setPosition = this.setPosition.bind(this);
        this.setIsOver = this.setIsOver.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
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
        if(this.state.mouseDown && (e.pageX + 48 < window.innerWidth) 
        && (e.pageY + 47 < document.body.scrollHeight) && (e.pageY - 47 > 186))
            this.setPosition(e);
    }

    componentDidMount()
    {
        document.addEventListener("mousemove",this.onMouseMove);
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove",this.onMouseMove);
    }

    render()
    {
        const icon = "https://www.google.com/s2/favicons?sz=64&domain_url="+this.props.link;
        let link = (this.props.link.substr(0,8) == "https://" || this.props.link.substr(0,7) == "http://") 
        ? this.props.link : "https://"+this.props.link;

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
                        this.props.setDropShortcutId();

                    this.props.isGrabbed(false);
                    this.setState({mouseDown:false});
                }}
                href={link}
                target="_blank" className="shortcut"
                style={
                    this.state.mouseDown
                    ? {
                        backgroundColor:this.props.color, 
                        height:this.props.height, 
                        width:this.props.width, position:"absolute", 
                        top:this.state.yPos/window.innerHeight*100+"%", 
                        left:this.state.xPos/window.innerWidth*100+"%", 
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
            </a>
        )
    }
}

export default Shortcut;