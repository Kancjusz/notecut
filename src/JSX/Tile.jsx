import React from "react";
import { Component } from "react";
import Shortcut from "./Shortcut";
import "../CSS/tileStyle.css"
import Folder from "./Folder";
import binImg from "../img/bin.png";


class Tile extends Component{
    constructor(props)
    {
        super(props)

        this.state={
            liesIn:false,
        }

        this.onMouseMove = this.onMouseMove.bind(this);

        this.tile = React.createRef();
    }

    onMouseMove(e)
    {
        if(!this.props.isGrabbed)
        {
            this.setState({liesIn:false});
            return;
        } 
        if((e.pageX > this.tile.current.offsetLeft && e.pageX < this.tile.current.offsetLeft + this.tile.current.offsetWidth)
            && (e.pageY > this.tile.current.offsetTop && e.pageY < this.tile.current.offsetTop + this.tile.current.offsetHeight))
            this.setState({liesIn:true});
        else
            this.setState({liesIn:false});
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
        return(
            <div className="tile" style={{height:this.props.height, width:this.props.width}} onMouseEnter={this.props.changeTile}>
                <div ref={this.tile} className={this.state.liesIn ? "tileInside over": "tileInside"} style={{borderRadius:5+"px", height:this.props.height, width:this.props.width}}>
                    {
                        this.props.id == 159 && <img src={binImg}></img>
                    }

                    {
                        this.props.hasShortcut && <Shortcut 
                            key={this.props.shortcut.id} 
                            id={this.props.shortcut.id} 
                            name={this.props.shortcut.name} 
                            link={this.props.shortcut.link} 
                            note={this.props.shortcut.note}
                            color={this.props.shortcut.color}
                            setDropShortcutId={this.props.setDropShortcutId}
                            height={this.props.height}
                            width={this.props.width}
                            isGrabbed={(e)=>this.props.setGrabbed(e)}
                            inFolder={false}
                        />
                    }
                    {
                        this.props.hasFolder && <Folder 
                            key={this.props.folder.id} 
                            id={this.props.folder.id} 
                            name={this.props.folder.name} 
                            note={this.props.folder.note}
                            color={this.props.folder.color}
                            shortcuts={this.props.folder.shortcuts}
                            setDropShortcutId={(inFolder,id)=>this.props.setDropShortcutId(inFolder,id)}
                            height={this.props.height}
                            width={this.props.width}
                            isGrabbed={(e)=>this.props.setGrabbed(e)}
                            changeTile={this.props.changeTile}
                        />
                    }
                </div>     
            </div>
        );
    }
}

export default Tile;