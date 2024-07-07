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
        this.onTouchUp = this.onTouchUp.bind(this);
        this.getTileDocumentPosition = this.getTileDocumentPosition.bind(this);

        this.tile = React.createRef();
    }

    getTileDocumentPosition()
    {
        if(this.tile.current == null) return;

        var bodyRect = document.body.getBoundingClientRect();
        var elemRect = this.tile.current.getBoundingClientRect();

        return{
            left: elemRect.left - bodyRect.left,
            right: bodyRect.right - elemRect.right,
            top: elemRect.top - bodyRect.top,
            bottom: bodyRect.bottom - elemRect.bottom
        }
    }

    onTouchUp(e)
    {
        if(this.state.liesIn){
            this.setState({liesIn:false});
            this.props.changeTile();
        }
    }

    onMouseMove(e1)
    {
        let e = {pageX:e1.pageX, pageY:e1.pageY};

        if(e1.type == 'touchmove'){    
            if(this.props.isGrabbed) e1.preventDefault();
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {pageX:e1.pageX, pageY:e1.pageY};
        }

        if(!this.props.isGrabbed)
        {
            this.setState({liesIn:false});
            return;
        } 

        let offset = this.getTileDocumentPosition();
        let leftOffset = offset.left;
        let topOffset = offset.top;

        if((e.pageX > leftOffset && e.pageX < leftOffset + this.tile.current.offsetWidth)
            && (e.pageY > topOffset && e.pageY < topOffset + this.tile.current.offsetHeight))
            this.setState({liesIn:true});
        else
            this.setState({liesIn:false});
    }

    componentDidMount()
    {
        document.addEventListener("mousemove",this.onMouseMove);
        document.addEventListener("touchend",this.onTouchUp, { passive: false });
        document.addEventListener("touchmove",this.onMouseMove, { passive: false });
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove",this.onMouseMove);
        document.removeEventListener("touchup",this.onTouchUp);
        document.removeEventListener("touchmove",this.onMouseMove);
    }

    render()
    {
        let tileBorder = "";
        let tileInsideBorder = "";
        switch(this.props.id)
        {
            case 0:
                tileBorder = "15px 0 0 0";
                tileInsideBorder = "15px 5px 5px 5px";
                break;
            case 11:
                tileBorder = "0 15px 0 0";
                tileInsideBorder = "5px 15px 5px 5px";
                break;
            case 84:
                tileBorder = "0 0 0 15px";
                tileInsideBorder = "5px 5px 5px 15px";
                break;
            case 95:
                tileBorder = "0 0 15px 0";
                tileInsideBorder = "5px 5px 15px 5px";
                break;
            default:
                tileBorder = "0 0 0 0";
                tileInsideBorder = "5px";
                break;
        }

        return(
            <div className="tile" style={{
                height:this.props.height, 
                width:this.props.width,
                borderRadius:tileBorder
            }} onMouseEnter={this.props.changeTile}>
                <div ref={this.tile} onContextMenu={(e)=>e.preventDefault()} className={this.state.liesIn ? "tileInside over": "tileInside"} style={ this.state.liesIn ? {
                    borderRadius:tileInsideBorder, 
                    height:this.props.height, width:this.props.width
                } : {
                    borderRadius:tileInsideBorder, 
                    background:this.props.backgroundColor,
                    height:this.props.height, width:this.props.width
                }}>
                    {
                        this.props.id == this.props.size-1 && <img src={binImg}></img>
                    }

                    {
                        this.props.hasShortcut && <Shortcut 
                            key={this.props.shortcut.id} 
                            id={this.props.shortcut.id} 
                            name={this.props.shortcut.name} 
                            link={this.props.shortcut.link} 
                            note={this.props.shortcut.note}
                            color={this.props.shortcut.color}
                            setDropShortcutId={(autoChangeTile)=>this.props.setDropShortcutId(false,this.props.shortcut.id,autoChangeTile)}
                            changeTile = {this.props.changeTile}
                            height={this.props.height}
                            width={this.props.width}
                            isGrabbed={(e)=>this.props.setGrabbed(e)}
                            setEditData={this.props.setEditData}
                            inFolder={false}
                            headerHeight={this.props.headerHeight}
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
                            offset={this.getTileDocumentPosition()}
                            setDropShortcutId={(inFolder,id,autoChangeTile)=>this.props.setDropShortcutId(inFolder,id,autoChangeTile)}
                            height={this.props.height}
                            width={this.props.width}
                            isGrabbed={(e)=>this.props.setGrabbed(e)}
                            setEditData={this.props.setEditData}
                            changeTile={this.props.changeTile}
                            headerHeight={this.props.headerHeight}
                        />
                    }
                </div>     
            </div>
        );
    }
}

export default Tile;