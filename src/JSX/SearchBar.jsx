import React, { useState } from "react";
import searchImg from "../img/search.png";
import "../CSS/searchBarStyle.css";

const SearchBar = (props) =>{

    const input = document.getElementsByClassName("searchBarInput");
    const [query, setQuery] = useState("");

    const refactorQuery = (query) =>{
        query = query.trim();
        query.replaceAll(" ","+");
        setQuery(query);
    }

    const openPage = () =>{
        window.open(props.engine+"/search?q="+query, props.newTab ? "_blank" : "_self");
    }

    return(
        <div className="searchBar" onLoad={()=>refactorQuery(document.getElementsByClassName('searchBarInput')[0].value)}>
            <input className="searchBarInput" type="text" onChange={(e)=>refactorQuery(e.target.value)} onKeyDown={(e)=>{
                if(e.key === "Enter")
                    openPage();
            }}/>
            <img className="searchButtonImg" src={searchImg} alt="Search button" onClick={openPage}/>
        </div>
    );
}

export default SearchBar;