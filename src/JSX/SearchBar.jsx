import React, { useState } from "react";
import searchImg from "../img/search.png";
import "../CSS/searchBarStyle.css";

const SearchBar = (props) =>{

    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [matches, setMatches] = useState([]);

    const findShortcutMatches = (query) =>{
        let currentMatches = [];
        if(query === "") {
            setMatches(currentMatches);
            return;
        }

        let regExp = new RegExp(`${query}`, "g");

        props.shortcuts.forEach((sc,i)=>{
            if(sc.name.match(regExp) != null)
                currentMatches.push(i);
        });
        setMatches(currentMatches);
    }

    const findFolderMatches = (query) =>{
        let currentMatches = [];
        let regExp = new RegExp(`${query}`, "g");

        props.shortcuts.forEach((sc,i)=>{
            if(sc.name.match(regExp).length > 0)
                currentMatches.push(i);
        });
        setMatches(currentMatches);
    }

    const refactorQuery = (query) =>{
        if(props.findShortcuts)
            findShortcutMatches(query);

        query = query.trim();
        query.replaceAll(" ","+");
        setQuery(query);
    }

    const openPage = () =>{
        window.open(props.engine+"/search?q="+query, props.newTab ? "_blank" : "_self");
    }

    return(
        <div className="searchBar" onLoad={()=>refactorQuery(document.getElementsByClassName('searchBarInput')[0].value)} onBlur={()=>setFocused(false)}>
            <input className="searchBarInput" type="text" onFocus={()=>setFocused(true)}
            onChange={(e)=>refactorQuery(e.target.value)} onKeyDown={(e)=>{
                if(e.key === "Enter")
                    openPage();
            }}/>
            <img className="searchButtonImg" src={searchImg} alt="Search button" onClick={openPage}/>

            {props.findShortcuts && (focused || focused2) && matches.length > 0 && <div className="searchList" onMouseEnter={()=>setFocused2(true)} onMouseLeave={()=>setFocused2(false)}>
                {matches.map((e)=>{
                    const shortcut = props.shortcuts[e];
                    const favicon = "https://www.google.com/s2/favicons?sz=64&domain_url=" + shortcut.link;
                    let link = (shortcut.link.substr(0,8) === "https://" || shortcut.link.substr(0,7) === "http://") 
                        ? shortcut.link : "https://"+shortcut.link;

                    return(
                        <a href={link} target="_blank">
                            <img src={favicon}/>
                            <span>{shortcut.name}</span>
                        </a>
                    );
                })}
            </div>}
        </div>
    );
}

export default SearchBar;