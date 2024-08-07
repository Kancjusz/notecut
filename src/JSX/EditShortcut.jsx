import React from "react";
import "../CSS/editShortcutStyle.css";

const EditShortcut = (props) =>{

    return(
        <div className="editBox" style={{
            backgroundColor:props.color,
            opacity:1,
            position:props.doDelete ? "absolute" : "relative",
            top: props.posY+"px",
            left: props.posX+"px",
        }}>
            
            <div className="colorOverlay" onMouseDown={props.setEditData} onTouchStart={props.setEditData} style={{
                borderRadius: (props.doDelete ? "5px 5px 0 0" : "5px")
            }}>
                <p>Edit</p>
            </div>
            {props.doDelete && <div className="colorOverlay" onTouchStart={props.setDeleteData} onMouseDown={props.setDeleteData} style={{
                borderRadius: (props.doDelete ? "0 0 5px 5px" : "5px")
            }}>
                <p>Delete</p>
            </div>}
        </div>
    );

}

export default EditShortcut;