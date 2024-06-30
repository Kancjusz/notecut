import React, { useEffect, useRef, useState } from "react"
import "../CSS/noteStyle.css"

const Note = (props) => {
    const [opened,_setOpened] = useState(props.note.opened);
    const [move, _setMove] = useState(false);
    const [overArrow, _setOverArrow] = useState(false);
    const [isOver, _setIsOver] = useState(false);
    const [posX, setPosX] = useState(props.note.position.x);
    const [posY, setPosY] = useState(props.note.position.y);

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
            const height = openedRef.current ? props.note.height/2 : 20;

            let x = e.pageX - props.note.width/2;
            let y = e.pageY - height;

            if(!(e.pageX + props.note.width/2 < window.innerWidth)) 
                x = window.innerWidth - props.note.width;
            else if(!(e.pageX - props.note.width/2 > 0)) 
                x = 0;

            if(!(e.pageY + height < document.body.scrollHeight)) 
                y = document.body.scrollHeight - props.note.height;
            else if(!(e.pageY - height > window.innerHeight*0.15)) 
                y = window.innerHeight*0.15;

            setPosX(x/window.innerWidth*100);
            setPosY(y/window.innerHeight*100);

            props.changePosition(x/window.innerWidth*100,y/window.innerHeight*100);
        }

        setMove(false);
    }

    const onMoseDown = (e) =>{
        if(!isOverRef.current || overArrowRef.current) return;

        const x = e.pageX/window.innerWidth*100;
        const y = e.pageY/window.innerHeight*100;

        setPosX(x);
        setPosY(y);

        setMove(true);
    }

    useEffect(()=>{
        window.addEventListener("mouseup",onMoseUp);
        window.addEventListener("mousedown",onMoseDown);

        return()=>{
            window.removeEventListener("mouseup",onMoseUp);
            window.removeEventListener("mousedown",onMoseDown);
        };
    },[]);

    return(
        <div style={{
            background: props.note.color,
            position:"absolute",
            top: posY+"%",
            left: posX+"%",
            width: props.note.width + "px",
            height: (opened ? props.note.height : 40) + "px",
            transform: (!move) ? "none" : "translate(-50%,-50%)",
            zIndex:100,
            borderRadius:7+"px",
            transition: "height 0.5s",
            overflow:"hidden"
        }} onMouseEnter={()=>{
            setIsOver(true);
        }} onMouseLeave={()=>{
            setIsOver(false);
        }} onMouseMove={(e)=>{
            const height = opened ? props.note.height/2 : 20;

            if(!move || !(e.pageX + props.note.width/2 < window.innerWidth) 
                || !(e.pageX - props.note.width/2 > 0) 
                || !(e.pageY + height < document.body.scrollHeight) 
                || !(e.pageY - height > window.innerHeight*0.15)) return; 

            const x = e.pageX/window.innerWidth*100;
            const y = e.pageY/window.innerHeight*100;

            setPosX(x);
            setPosY(y);
        }}>
            <div className="noteHeader">
                <h4>{props.note.name}</h4>
                <h4 onClick={()=>{setOpened(!opened); props.changeOpened(!opened)}} onMouseOver={()=>setOverArrow(true)} onMouseOut={()=>setOverArrow(false)}>{opened ? "▲" : "▼"}</h4>
            </div>
            <div className="noteContents">
                <p dangerouslySetInnerHTML={{__html:contents}}></p>
            </div>
        </div>
    );
}

export default Note;