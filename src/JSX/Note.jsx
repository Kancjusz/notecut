import React, { useEffect, useRef, useState } from "react"
import "../CSS/noteStyle.css"
import EditShortcut from "./EditShortcut";

const Note = (props) => {
    const [opened,_setOpened] = useState(props.note.opened);
    const [move, _setMove] = useState(false);
    const [overArrow, _setOverArrow] = useState(false);
    const [isOver, _setIsOver] = useState(false);
    const [showEdit, _setShowEdit] = useState(false);
    const [isOverResizeX, _setIsOverResizeX] = useState(false);
    const [isOverResizeY, _setIsOverResizeY] = useState(false);
    const [resizeX, _setresizeX] = useState(false);
    const [resizeY, _setresizeY] = useState(false);
    const [posX, _setPosX] = useState(props.note.position.x);
    const [posY, _setPosY] = useState(props.note.position.y);
    const [mousePos, _setMousePos] = useState({x:0,y:0});
    const [noteWidth, _setWidth] = useState(props.note.width);
    const [noteHeight, _setHeight] = useState(props.note.height);

    const resizeBarX = useRef();
    const resizeBarY = useRef();
    let pressTimer = useRef();

    const mousePosRef = useRef(mousePos);
    const setMousePos = data => {
        mousePosRef.current = data;
        _setMousePos(data);
    }

    const showEditRef = useRef(showEdit);
    const setShowEdit = data => {
        showEditRef.current = data;
        _setShowEdit(data);
    }

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

    const onMoseUp = (e1) =>{
        let e = {pageX:0, pageY:0};

        if(e1.type == 'touchend'){
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {pageX:e1.pageX, pageY:e1.pageY};
        }

        if(moveRef.current){
            clearTimeout(pressTimer);
            const height = openedRef.current ? heightRef.current/2 : 20;

            let x = e.pageX - widthRef.current/2;
            let y = e.pageY - height;

            if(!(e.pageX + widthRef.current/2 < window.innerWidth)) 
                x = window.innerWidth - widthRef.current;
            else if(!(e.pageX - widthRef.current/2 > 0)) 
                x = 0;

            if(!(e.pageY + height < document.body.scrollHeight)) 
                y = document.body.scrollHeight - heightRef.current;
            else if(!(e.pageY - height > props.headerHeight)) 
                y = props.headerHeight;

            setPosX(x/window.innerWidth*100);
            setPosY(y/window.innerHeight*100);

            props.changePosition(x/window.innerWidth*100,y/window.innerHeight*100);
        }

        setresizeX(false);
        setresizeY(false);
        setMove(false);
        if(e1.type == 'touchend') setIsOver(false);
    }

    const onMoseDown = (e1) =>{
        let e = {pageX:0, pageY:0, button:e1.button};

        if(e1.type == 'touchstart'){
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {...e,pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {...e,pageX:e1.pageX, pageY:e1.pageY};
        }

        setMousePos({x:e.pageX,y:e.pageY});

        if(isOverRef.current)
        {
            props.setZIndex();
            setShowEdit(e.button===2);
        }
        else
            setShowEdit(false);

        if(e.button === 2) return;

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

    const onMoseMove = (e1) =>{
        let e = {pageX:0, pageY:0};

        if(e1.type == 'touchmove'){    
            if(moveRef.current) e1.preventDefault();
            var touch = e1.touches[0] || e1.changedTouches[0];
            e = {pageX:touch.pageX, pageY:touch.pageY};
        } else {
            e = {pageX:e1.pageX, pageY:e1.pageY};
        }

        if(resizeXRef.current){
            let width = e.pageX - (posXRef.current/100) * window.innerWidth;
            width = width < 130 ? 130 : width;
            setWidth(width);
            props.setSize(width,heightRef.current);
            return;
        }

        if(resizeYRef.current){
            let height = e.pageY - (posYRef.current/100) * window.innerHeight;
            height = height < 120 ? 120 : height;
            if(e.pageY >= window.innerHeight) height = window.innerHeight - (posYRef.current/100) * window.innerHeight;
            setHeight(height);
            props.setSize(widthRef.current,height);
            return;
        }

        const height = openedRef.current ? heightRef.current/2 : 20;

        if(!moveRef.current) return;

        let x = e.pageX/window.innerWidth*100;
        let y = e.pageY/window.innerHeight*100;

        if(e.pageX + widthRef.current/2 > window.innerWidth) x = (window.innerWidth - widthRef.current/2)/window.innerWidth*100;
        else if(e.pageX - widthRef.current/2 < 0) x = widthRef.current/2/window.innerWidth*100;

        if(e.pageY + height > document.body.scrollHeight) y = (document.body.scrollHeight - height)/window.innerHeight*100;
        else if(e.pageY - height < props.headerHeight) y = (height + props.headerHeight)/window.innerHeight*100;

        setPosX(x);
        setPosY(y);
    }

    const onResize = () =>{
        const height = openedRef.current ? heightRef.current : 40;
        let x = posXRef.current/100*window.innerWidth;
        let y = posYRef.current/100*window.innerHeight;

        if(x + widthRef.current > window.innerWidth) 
            x = (window.innerWidth - widthRef.current);

        if(y + height > document.body.scrollHeight)
            y = (document.body.scrollHeight - height);
        if(y < props.headerHeight) 
            y = props.headerHeight;

        x = x/window.innerWidth*100;
        y = y/window.innerHeight*100;

        setPosX(x);
        setPosY(y);
        props.changePosition(x,y);
    }

    const touchNoteResizeX = (e) =>{
        e.preventDefault();
        setIsOverResizeX(true);
    }

    const touchNoteResizeY = (e) =>{
        e.preventDefault();
        setIsOverResizeY(true);
    }

    useEffect(()=>{
        window.addEventListener("mouseup",onMoseUp);
        window.addEventListener("mousedown",onMoseDown);
        window.addEventListener("mousemove",onMoseMove);
        window.addEventListener("resize",onResize);
            
        window.addEventListener("touchstart",onMoseDown, { passive: false });
        window.addEventListener("touchmove",onMoseMove, { passive: false });
        window.addEventListener("touchend",onMoseUp, { passive: false });

        if(resizeBarX.current != undefined) resizeBarX.current.addEventListener("touchstart",touchNoteResizeX, { passive: false });
        if(resizeBarY.current != undefined) resizeBarY.current.addEventListener("touchstart",touchNoteResizeY, { passive: false });

        return()=>{
            window.removeEventListener("mouseup",onMoseUp);
            window.removeEventListener("mousedown",onMoseDown);
            window.removeEventListener("mousemove",onMoseMove);
            window.removeEventListener("resize",onResize);

            window.removeEventListener("touchstart",onMoseDown);
            window.removeEventListener("touchmove",onMoseMove);
            window.removeEventListener("touchend",onMoseUp);

            if(resizeBarX.current != undefined) resizeBarX.current.removeEventListener("touchstart",touchNoteResizeX);
            if(resizeBarY.current != undefined) resizeBarY.current.removeEventListener("touchstart",touchNoteResizeY);
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
        }} onTouchStart={()=>{
            setIsOver(true);
        }} onMouseEnter={()=>{
            setIsOver(true);
        }} onMouseLeave={()=>{
            setIsOver(false);
        }} onContextMenu={(e1)=>{
            e1.preventDefault();

            let e = {pageX:0, pageY:0, button:e1.button};

            if(e1.type == 'touchstart'){
                var touch = e1.touches[0] || e1.changedTouches[0];
                e = {...e,pageX:touch.pageX, pageY:touch.pageY};
            } else {
                e = {...e,pageX:e1.pageX, pageY:e1.pageY};
            }

            setMousePos({x:e.pageX,y:e.pageY}); 
            setShowEdit(true);
        }}>
            <div style={{
                overflow:"hidden",
                width: 100+"%",height: 100+"%"
            }}>
                <div className="noteHeader">
                    <h4>{props.note.name}</h4>
                    <h4 onTouchStart={()=>{
                        setOverArrow(true);
                    }} onTouchEnd={()=>{
                        setOverArrow(false);
                    }}onClick={()=>{
                        setOpened(!opened); 
                        let posYPx = window.innerHeight * (posY/100);
                        if(posYPx + noteHeight > document.body.scrollHeight){
                            let newPosY = (posYPx - (posYPx + noteHeight - document.body.scrollHeight))/window.innerHeight*100;
                            setPosY(newPosY);
                            props.changePosition(posX,newPosY);
                        }
                        props.changeOpened(!opened);
                    }} onMouseOver={()=>setOverArrow(true)} onMouseOut={()=>setOverArrow(false)}>{opened ? "▲" : "▼"}</h4>
                </div>
                <div className="noteContents" onTouchStart={(e)=>{
                    let condition = e.target.nodeName == "DIV" ? e.target.scrollHeight : e.target.scrollHeight+52;
                    if(condition > (noteHeight-60))
                        setOverArrow(true);
                }} onTouchEnd={()=>{
                    setOverArrow(false);
                }} style={{
                    width:noteWidth-40+"px",
                    height:noteHeight-80+"px"
                }}>
                    <p dangerouslySetInnerHTML={{__html:contents}}></p>
                </div>
                <div className="resizeBarX" ref={resizeBarX} onMouseOver={()=>setIsOverResizeX(true)} onMouseOut={()=>setIsOverResizeX(false)} onTouchEnd={()=>{
                    setIsOverResizeX(false);
                }} style={{
                    left:noteWidth-10+"px"
                }}></div>
                <div className="resizeBarY" ref={resizeBarY} onMouseOver={()=>setIsOverResizeY(true)} onMouseOut={()=>setIsOverResizeY(false)} onTouchEnd={()=>{
                    setIsOverResizeY(false);
                }} style={{
                    top:noteHeight-10+"px",
                    height: (opened ? 10 : 0)+"px"
                }}></div>
            </div> 

            <div onMouseOver={()=>{setIsOver(false)}} onTouchStart={()=>{
                setOverArrow(true);
            }}>
                {showEdit && <EditShortcut
                        posX={mousePos.x-window.innerWidth*(posX/100)}
                        posY={mousePos.y-window.innerHeight*(posY/100)}
                        color={props.note.color}
                        setEditData={props.editNote}
                        setDeleteData={props.deleteNote}
                        doDelete={true}
                />}
            </div>
            
        </div>
    );
}

export default Note;