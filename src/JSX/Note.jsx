import React, { useEffect, useRef, useState } from "react"
import "../CSS/noteStyle.css"

const Note = (props) => {
    const [opened,_setOpened] = useState(props.note.opened);
    const [move, _setMove] = useState(false);
    const [overArrow, _setOverArrow] = useState(false);
    const [isOver, _setIsOver] = useState(false);
    const [isOverResizeX, _setIsOverResizeX] = useState(false);
    const [isOverResizeY, _setIsOverResizeY] = useState(false);
    const [resizeX, _setresizeX] = useState(false);
    const [resizeY, _setresizeY] = useState(false);
    const [posX, _setPosX] = useState(props.note.position.x);
    const [posY, _setPosY] = useState(props.note.position.y);
    const [noteWidth, _setWidth] = useState(props.note.width);
    const [noteHeight, _setHeight] = useState(props.note.height);

    const resizeXRef = useRef(resizeX);
    const setresizeX = data => {
        resizeXRef.current = data;
        _setresizeX(data);
    }

    const resizeYRef = useRef(resizeY);
    const setresizeY = data => {
        resizeYRef.current = data;
        _setresizeY(data);
    }

    const isOverResizeXRef = useRef(isOverResizeX);
    const setIsOverResizeX = data => {
        isOverResizeXRef.current = data;
        _setIsOverResizeX(data);
    }

    const isOverResizeYRef = useRef(isOverResizeY);
    const setIsOverResizeY = data => {
        isOverResizeYRef.current = data;
        _setIsOverResizeY(data);
    }

    const widthRef = useRef(noteWidth);
    const setWidth = data => {
        widthRef.current = data;
        _setWidth(data);
    }

    const heightRef = useRef(noteHeight);
    const setHeight = data => {
        heightRef.current = data;
        _setHeight(data);
    }

    const posXRef = useRef(posX);
    const setPosX = data => {
        posXRef.current = data;
        _setPosX(data);
    }

    const posYRef = useRef(posY);
    const setPosY = data => {
        posYRef.current = data;
        _setPosY(data);
    }

    const isOverRef = useRef(isOver);
    const setIsOver = data => {
        isOverRef.current = data;
        _setIsOver(data);
    }

    const moveRef = useRef(move);
    const setMove = data => {
        moveRef.current = data;
        _setMove(data);
    }

    const overArrowRef = useRef(overArrow);
    const setOverArrow = data => {
        overArrowRef.current = data;
        _setOverArrow(data);
    }

    const openedRef = useRef(opened);
    const setOpened = data => {
        openedRef.current = data;
        _setOpened(data);
    }

    const contents = props.note.note.replaceAll("\n","<br/>");

    const onMoseUp = (e) =>{
        if(moveRef.current){
            const height = openedRef.current ? heightRef.current/2 : 20;

            let x = e.pageX - widthRef.current/2;
            let y = e.pageY - height;

            if(!(e.pageX + widthRef.current/2 < window.innerWidth)) 
                x = window.innerWidth - widthRef.current;
            else if(!(e.pageX - widthRef.current/2 > 0)) 
                x = 0;

            if(!(e.pageY + height < document.body.scrollHeight)) 
                y = document.body.scrollHeight - heightRef.current;
            else if(!(e.pageY - height > window.innerHeight*0.15)) 
                y = window.innerHeight*0.15;

            setPosX(x/window.innerWidth*100);
            setPosY(y/window.innerHeight*100);

            props.changePosition(x/window.innerWidth*100,y/window.innerHeight*100);
        }

        setMove(false);
        setresizeX(false);
        setresizeY(false);
    }

    const onMoseDown = (e) =>{
        if(isOverRef.current)
            props.setZIndex();

        if(isOverResizeXRef.current) {
            setresizeX(true);
            return;
        }

        if(isOverResizeYRef.current) {
            setresizeY(true);
            return;
        }

        if(!isOverRef.current || overArrowRef.current) return;

        const x = e.pageX/window.innerWidth*100;
        const y = e.pageY/window.innerHeight*100;

        setPosX(x);
        setPosY(y);

        setMove(true);
    }

    const onMoseMove = (e) =>{
        if(resizeXRef.current){
            let width = e.pageX - (posXRef.current/100) * window.innerWidth;
            setWidth(width);
            props.setSize(width,heightRef.current);
            return;
        }

        if(resizeYRef.current){
            let height = e.pageY - (posYRef.current/100) * window.innerHeight;
            setHeight(height);
            props.setSize(widthRef.current,height);
            return;
        }

        const height = openedRef.current ? heightRef.current/2 : 20;

        if(!moveRef.current || !(e.pageX + widthRef.current/2 < window.innerWidth) 
            || !(e.pageX - widthRef.current/2 > 0) 
            || !(e.pageY + height < document.body.scrollHeight) 
            || !(e.pageY - height > window.innerHeight*0.15)) return; 

        const x = e.pageX/window.innerWidth*100;
        const y = e.pageY/window.innerHeight*100;

        setPosX(x);
        setPosY(y);
    }

    useEffect(()=>{
        window.addEventListener("mouseup",onMoseUp);
        window.addEventListener("mousedown",onMoseDown);
        window.addEventListener("mousemove",onMoseMove);

        return()=>{
            window.removeEventListener("mouseup",onMoseUp);
            window.removeEventListener("mousedown",onMoseDown);
            window.removeEventListener("mousemove",onMoseMove);
        };
    },[]);

    return(
        <div style={{
            background: props.note.color,
            position:"absolute",
            top: posY+"%",
            left: posX+"%",
            width: noteWidth + "px",
            height: (opened ? noteHeight : 40) + "px",
            transform: (!move) ? "none" : "translate(-50%,-50%)",
            zIndex: props.note.zIndex,
            borderRadius:7+"px",
            transition: resizeY ? "none" : "height 0.5s",
            overflow:"hidden"
        }} onMouseEnter={()=>{
            setIsOver(true);
        }} onMouseLeave={()=>{
            setIsOver(false);
        }}>
            <div className="noteHeader">
                <h4>{props.note.name}</h4>
                <h4 onClick={()=>{setOpened(!opened); props.changeOpened(!opened)}} onMouseOver={()=>setOverArrow(true)} onMouseOut={()=>setOverArrow(false)}>{opened ? "▲" : "▼"}</h4>
            </div>
            <div className="noteContents" style={{
                width:noteWidth-40+"px",
                height:noteHeight-80+"px"
            }}>
                <p dangerouslySetInnerHTML={{__html:contents}}></p>
            </div>
            <div className="resizeBarX" onMouseOver={()=>setIsOverResizeX(true)} onMouseOut={()=>setIsOverResizeX(false)} style={{
                left:noteWidth-10+"px"
            }}></div>
            {opened && <div className="resizeBarY" onMouseOver={()=>setIsOverResizeY(true)} onMouseOut={()=>setIsOverResizeY(false)} style={{
                top:noteHeight-10+"px"
            }}></div>}
        </div>
    );
}

export default Note;