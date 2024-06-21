import React from "react";
import "../CSS/editShortcutStyle.css";

const EditShortcut = (props) =>{

    return(
        <div className="editBox" style={{
            backgroundColor:props.color,
            opacity:1,
            position:"absolute",
            top: props.posY+"px",
            left: props.posX+"px"
        }}>
            <div className="colorOverlay">
                <p>Edit</p>
            </div>
        </div>
    );

}

export default EditShortcut;