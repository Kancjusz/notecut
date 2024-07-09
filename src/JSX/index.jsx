import React, { Component, createRef } from "react";
import ShortcutForm from "./ShortcutForm";
import FolderForm from "./FolderForm";
import { showGrid,hideGrid } from "../Scripts/showGrid";
import Tile from "./Tile"
import settingsImg from "../img/settings.png"
import "../CSS/indexStyle.css"
import Settings from "./Settings";
import SearchBar from "./SearchBar";
import NoteForm from "./NoteForm";
import Note from "./Note";

class App extends Component
{
    constructor()
    {
        super()
        
        this.size = 96;
        // eslint-disable-next-line
        let shortcuts = localStorage.getItem("shortcuts") === null ? [] : JSON.parse(localStorage.getItem("shortcuts")) == [] ? [] : JSON.parse(localStorage.getItem("shortcuts"));
        // eslint-disable-next-line
        let tiles = localStorage.getItem("tiles") === null ? [] : JSON.parse(localStorage.getItem("tiles")) == [] ? [] : JSON.parse(localStorage.getItem("tiles"));
        // eslint-disable-next-line
        let folders = localStorage.getItem("folders") === null ? [] : JSON.parse(localStorage.getItem("folders")) == [] ? [] : JSON.parse(localStorage.getItem("folders"));  
        // eslint-disable-next-line
        let notes = localStorage.getItem("notes") === null ? [] : JSON.parse(localStorage.getItem("notes")) == [] ? [] : JSON.parse(localStorage.getItem("notes"));

        let settings = localStorage.getItem("settings") === null ? {
            headerColor: "rgba(0, 0, 0, 0.404)",
            contentColor: "grey",
            tilesColor: "dimgrey",
            borderColor: "linear-gradient(to right, red 4%, orange 20%, yellow 36%, green 52%, blue 68%, indigo 84%, violet 100%)",
            animate:true,

            showSearchBar:true,
            searchEngine:"https://www.google.com",
            newTab:true,
            findShortcuts:true,
            separateNotes:false,
            displayNotes:true,
            displayNotesOpen:true,
        } : JSON.parse(localStorage.getItem("settings"));

        let tilesDivWidth = this.getTilesDivWidth();
        console.log(tilesDivWidth);

        this.state = {
            shortcuts:shortcuts,
            folders:folders,
            tiles:tiles,
            notes:notes,

            tileHeight:window.innerWidth <= 600 ? tilesDivWidth/6 : 80.4125,
            tileWidth:tilesDivWidth/ (window.innerWidth <= 600 ?  6 : 12),
            tilesWindowWidth:tilesDivWidth,
            headerheight:137,

            showShortcutForm:false,
            showFolderForm:false,
            showNoteForm:false,
            showSettings:false,

            dropShortcutId:-1,
            ogTileId:-1,
            isGrabbed:false,
            isShortcut:false,
            inFolder:false,

            noFreeSpace:false,

            editShortcutId:-1,
            editShortcutForm:false,
            editFolderForm:false,
            editNoteForm:false,

            updateLocalStorage:true,

            settings:settings
        }

        this.addShortcut = this.addShortcut.bind(this);
        this.addFolder = this.addFolder.bind(this);
        this.addNote = this.addNote.bind(this);   
        this.showShortcutForm = this.showShortcutForm.bind(this);
        this.showFolderForm = this.showFolderForm.bind(this);
        this.showNoteForm = this.showNoteForm.bind(this);
        this.showSettings = this.showSettings.bind(this);
        this.createTilesArray = this.createTilesArray.bind(this);
        this.setDropShortcutId = this.setDropShortcutId.bind(this);
        this.changeTile = this.changeTile.bind(this);
        this.setGrabbed = this.setGrabbed.bind(this);
        this.getTileIdByShortcutId = this.getTileIdByShortcutId.bind(this);
        this.getTileIdByFolderId = this.getTileIdByFolderId.bind(this);
        this.setToStorage = this.setToStorage.bind(this);
        this.checkFreeSpace = this.checkFreeSpace.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.getTilesDivWidth = this.getTilesDivWidth.bind(this);
        this.editShortcut = this.editShortcut.bind(this);
        this.editFolder = this.editFolder.bind(this);
        this.editNote = this.editNote.bind(this);
        this.changeNotePosition = this.changeNotePosition.bind(this);  
        this.changeNoteOpened = this.changeNoteOpened.bind(this); 
        this.setNotesZIndex = this.setNotesZIndex.bind(this); 
        this.setNoteSize = this.setNoteSize.bind(this); 
        this.deleteNote = this.deleteNote.bind(this);     

        this.main = createRef();
    }

    showShortcutForm()
    {
        this.setState({
            showShortcutForm: !this.state.showShortcutForm,
            showFolderForm: false,
            showSettings: false,
            showNoteForm:false
        });
    }

    showFolderForm()
    {
        this.setState({
            showFolderForm: !this.state.showFolderForm,
            showShortcutForm: false,
            showSettings: false,
            showNoteForm:false
        });
    }

    showNoteForm()
    {
        this.setState({
            showNoteForm: !this.state.showNoteForm,
            showFolderForm:false,
            showShortcutForm: false,
            showSettings: false
        });
    }

    showSettings()
    {
        this.setState({
            showSettings: !this.state.showSettings,
            showFolderForm: false,
            showShortcutForm: false,
            showNoteForm:false
        });
    }

    checkFreeSpace()
    {
        for(let i = 0; i < this.state.tiles.length; i++)
        {
            if(!this.state.tiles[i].hasFolder && !this.state.tiles[i].hasShortcut && i !== this.size-1)
                return i;
        }
        return -1;
    }

    addShortcut(name,link,note,color)
    {
        if(color == "") color = "#000000";
        let shortcuts = this.state.shortcuts;

        let shortcut = {
            id:shortcuts.length,
            name: name,
            link: link,
            note: note,
            color: color,
            inFolder:-1
        }

        let tiles = this.state.tiles;

        let freeId = this.checkFreeSpace();

        if(freeId === -1)
        {
            this.setState({noFreeSpace:true,showShortcutForm:false});
            return;
        }

        tiles[freeId] = {
            id:tiles[freeId].id,
            hasShortcut:true,
            hasFolder:false,
            shortcutId:shortcuts.length,
            folderId:0,
        }

        shortcuts = [...shortcuts,shortcut];

        this.setState({
            showShortcutForm:false,
            tiles: tiles,
            shortcuts: shortcuts
        });
    }

    addFolder(name,note,color)
    {
        if(color == "") color = "#000000";
        let folders = this.state.folders;

        let folder = {
            id:folders.length,
            name: name,
            note: note,
            color:color,
            shortcuts:[],
        }

        let tiles = this.state.tiles;

        let freeId = this.checkFreeSpace();

        if(freeId === -1)
        {
            this.setState({noFreeSpace:true,showFolderForm:false});
            return;
        }

        tiles[freeId] = {
            id:tiles[freeId].id,
            hasShortcut:false,
            hasFolder:true,
            shortcutId:0,
            folderId:folders.length,
        }

        folders = [...folders,folder];

        this.setState({
            showFolderForm:false,
            tiles: tiles,
            folders: folders
        });
    }

    addNote(name,contents,color)
    {
        let notes = this.state.notes;

        let note = {
            id:notes.length,
            name: name,
            note: contents,
            color:color,
            position:{
                x:0,
                y:15
            },
            opened:true,
            width:200,
            height:300,
            zIndex:notes.length+10
        }

        notes = [...notes,note];

        this.setState({
            showNoteForm:false,
            notes: notes
        });
    }

    editShortcut(name,link,desc,color)
    {
        let shortcuts = this.state.shortcuts;
        let id = this.state.editShortcutId;

        let shortcut = {
            id:id,
            name: name,
            link: link,
            note: desc,
            color: color,
        }

        shortcuts[id] = shortcut;

        this.setState({
            shortcuts:shortcuts,
            editShortcutId:-1,
            editShortcutForm:false
        });
    }

    editFolder(name,desc,color)
    {
        let folders = this.state.folders;
        let id = this.state.editShortcutId;

        folders[id].name = name;
        folders[id].note = desc;
        folders[id].color = color;


        this.setState({
            folders:folders,
            editShortcutId:-1,
            editFolderForm:false
        });
    }

    editNote(name,note,color)
    {
        let notes = this.state.notes;
        let id = this.state.editShortcutId;

        notes[id].name = name;
        notes[id].note = note;
        notes[id].color = color;


        this.setState({
            notes:notes,
            editShortcutId:-1,
            editNoteForm:false
        });
    }

    createTilesArray(size)
    {
        let tiles = new Array(size);
        for(let i = 0; i < size; i++)
        {
            tiles[i] = {id:i,hasShortcut:false,hasFolder:false,folderId:0,shortcutId:0};
        }

        this.setState({
            tiles:tiles
        });
    }

    setDropShortcutId(shortcutId,tileId,inForm,shortuctInFormId,autoChangeTile)
    {  
        let tiles = this.state.tiles;
        let isShortcut = tiles[tileId].hasShortcut;
        let folders = this.state.folders;

        let state = {};

        if(inForm !== undefined && inForm === true && shortuctInFormId !== undefined)
        {
            let folder = folders[shortcutId];
            let ogId = shortcutId;

            isShortcut = true;
            shortcutId = shortuctInFormId;

            let id = 0;
            for(let i = 0; i < folder.shortcuts.length; i++)
            {
                if(this.state.shortcuts[folder.shortcuts[i]].id === shortcutId)
                {
                    id = i;
                    break;
                }
            }

            let shortcuts = folder.shortcuts;
            shortcuts.splice(id,1);
            folder.shortcuts = shortcuts;
            folders[ogId] = folder;

            tiles[tileId] = {
                id:tileId,
                hasShortcut:false,
                shortcutId:0,
                hasFolder:true,
                folderId:ogId
            }

            state.inFolder = true;
        }
        else
        {
            tiles[tileId] = {
                id:tileId,
                hasShortcut:false,
                shortcutId:0,
                hasFolder:false,
                folderId:0
            }
        }

        state = {
            isShortcut:isShortcut,
            dropShortcutId:shortcutId,
            tiles:tiles,
            folders:folders,
            ogTileId:tileId,
        }

        if(autoChangeTile) 
            this.changeTile(tileId,state);
        else
            this.setState(state);
    }

    setGrabbed(val)
    {
        if(val) showGrid();
        else hideGrid();

        this.setState({isGrabbed:val});
    }

    getTileIdByShortcutId(id)
    {
        for(let i = 0; i < this.state.tiles.length;i++)
        {
            if(this.state.tiles[i].hasShortcut && this.state.tiles[i].shortcutId === id)
                return i;
        }
    }

    getTileIdByFolderId(id)
    {
        for(let i = 0; i < this.state.tiles.length;i++)
        {
            if(this.state.tiles[i].hasFolder && this.state.tiles[i].folderId === id)
                return i;
        }
    }

    changeTile(id,state)
    {
        if(this.state.dropShortcutId === -1 && state == null) return;  

        let currentState = state == null ? this.state : state;

        let tiles = currentState.tiles;
        let dropId = currentState.dropShortcutId;

        let hasShortcut = currentState.isShortcut;
        let hasFolder = !currentState.isShortcut;
        let shortcutId = dropId;
        let folderId = dropId;

        if(id === this.size-1) 
        {    
            if(hasShortcut) 
            {
                let folders = [...this.state.folders];
                let shortcuts = [...this.state.shortcuts];
                let newShortcuts = [];

                newShortcuts = shortcuts.filter((e)=>e.id !== shortcutId);
                newShortcuts.forEach((e,i)=>{
                    if(e.inFolder === -1) 
                        tiles[this.getTileIdByShortcutId(e.id)].shortcutId = i;
                    else if(folders.length > 0)
                    {
                        folders[e.inFolder].shortcuts = folders[e.inFolder].shortcuts.map((sc)=>{
                            if(sc !== i) 
                                return i;
                            return sc;
                        });
                    }
                    e.id = i;
                })         

                this.setState({
                    shortcuts:newShortcuts,
                    folders:folders,
                    dropShortcutId:-1,
                    ogTileId:-1,
                    inFolder: false
                });
                return;
            }
            else if(hasFolder)
            {
                let folders = this.state.folders;
                let shortcuts = this.state.shortcuts;
                let folder = folders[folderId];

                let newFolders = folders.filter((e)=>e.id !== folderId);
                newFolders.forEach((e,i)=>{
                    tiles[this.getTileIdByFolderId(e.id)].folderId = i;
                    e.id = i;
                    shortcuts = shortcuts.map((sc)=>{
                        let newSc = {...sc};
                        if(e.shortcuts.filter((sc2)=>newSc.id === sc2).length > 0)
                            newSc.inFolder = i;
                        return newSc;
                    });
                })

                let newShortcuts = shortcuts.filter((e)=>folder.shortcuts.filter((sc)=>e.id === sc).length <= 0);
                newShortcuts.forEach((e,i)=>{
                    if(e.inFolder === -1) 
                        tiles[this.getTileIdByShortcutId(e.id)].shortcutId = i;
                    else if(newFolders.length > 0)
                    {
                        newFolders[e.inFolder].shortcuts = newFolders[e.inFolder].shortcuts.map((sc)=>{
                            if(sc !== i) 
                                return i;
                            return sc;
                        });
                    }
                    e.id = i;
                });

                this.setState({
                    tiles:tiles,
                    folders:newFolders,
                    shortcuts:newShortcuts,
                    dropShortcutId:-1,
                    ogTileId:-1,
                    inFolder: false
                });
                return;
            }
        }

        if(hasFolder && tiles[id].hasFolder && tiles[id].folderId === folderId) 
        {
            this.setState({
                dropShortcutId:-1,
                ogTileId:-1,
                inFolder: false
            })
            return;
        }


        let folders = [...this.state.folders];
        let stateShortcuts = [...this.state.shortcuts];

        if(tiles[id].hasShortcut || (tiles[id].hasFolder && hasFolder))
        {
            if(this.state.inFolder)
            {
                tiles[this.state.ogTileId] ={
                    id:this.state.ogTileId,
                    hasShortcut:false,
                    hasFolder:true,
                    shortcutId:tiles[this.state.ogTileId].shortcutId,
                    folderId:tiles[this.state.ogTileId].folderId
                }

                let shortcuts = folders[tiles[this.state.ogTileId].folderId].shortcuts;
                shortcuts = [...shortcuts,this.state.shortcuts[tiles[id].shortcutId].id];

                folders[tiles[this.state.ogTileId].folderId].shortcuts = shortcuts;
            }
            else
            {
                tiles[this.state.ogTileId] ={
                    id:this.state.ogTileId,
                    hasShortcut:tiles[id].hasShortcut,
                    hasFolder:tiles[id].hasFolder,
                    shortcutId:tiles[id].shortcutId,
                    folderId:tiles[id].folderId
                };

            }
        }
        else if(tiles[id].hasFolder && hasShortcut)
        {
            let folder = folders[tiles[id].folderId];

            if(folder.shortcuts.length > 0 && this.state.shortcuts[folder.shortcuts[folder.shortcuts.length-1]].id === this.state.shortcuts[shortcutId].id) 
                return;

            let shortcut = stateShortcuts[shortcutId];
            shortcut.inFolder = folder.id;
            stateShortcuts[shortcutId] = shortcut;

            folder.shortcuts.push(shortcut.id);

            folders[tiles[id].folderId] = folder;

            hasShortcut = false;
            hasFolder = true;
            folderId = tiles[id].folderId;
        }

        tiles[id] = {
            id:id,
            hasShortcut:hasShortcut,
            hasFolder:hasFolder,
            shortcutId:shortcutId,
            folderId:folderId
        }

        if(stateShortcuts.length > 0 && hasShortcut) stateShortcuts[shortcutId].inFolder = -1;

        this.setState({
            tiles:tiles,
            dropShortcutId:-1,
            folders:folders,
            shortcuts:stateShortcuts,
            ogTileId:-1,
            inFolder: false
        });

    }

    changeNotePosition(x,y,id)
    {
        let notes = this.state.notes;
        notes[id].position = {x:x, y:y};
        this.setState({notes:notes});
    }

    changeNoteOpened(opened,id)
    {
        let notes = this.state.notes;
        notes[id].opened = opened;
        this.setState({notes:notes});
    }

    setNotesZIndex(id)
    {
        let notes = this.state.notes;

        let originalZIndex = notes[id].zIndex;

        notes.forEach((e)=>{
            if(e.zIndex > originalZIndex)
                e.zIndex--;
        });
        notes[id].zIndex = notes.length+10;

        this.setState({notes:notes});
    }

    setNoteSize(width,height,id)
    {
        let notes = this.state.notes;
        notes[id].width = width;
        notes[id].height = height;
        this.setState({notes:notes});
    }

    deleteNote(id)
    {
        let notes = [...this.state.notes];
        notes.splice(id,1);
        notes.forEach((e,i)=>{
            e.id = i;     
        });

        localStorage.setItem("notes",JSON.stringify(notes));

        this.setState({notes:[], updateLocalStorage:false});        
    }

    setToStorage(tiles,shortcuts,folders,settings,notes)
    {
        localStorage.setItem("tiles",JSON.stringify(tiles));
        localStorage.setItem("shortcuts",JSON.stringify(shortcuts));
        localStorage.setItem("folders",JSON.stringify(folders));
        localStorage.setItem("settings",JSON.stringify(settings));
        if(this.state.updateLocalStorage)
            localStorage.setItem("notes",JSON.stringify(notes));
    }

    getTilesDivWidth()
    {
        return window.innerWidth < (1920 * 0.5 + 6) ? window.innerWidth - 6 : 1920 * 0.5;
    }

    updateDimensions()
    {
        let tilesDivWidth = this.getTilesDivWidth();

        this.setState({ tileWidth: tilesDivWidth/ (window.innerWidth <= 600 ?  6 : 12), tilesWindowWidth: tilesDivWidth, tileHeight: window.innerWidth <= 600 ? tilesDivWidth/6 : 80.4125});
    }

    componentDidMount()
    {
        window.addEventListener('resize', this.updateDimensions);
        if(!this.state.tiles.length > 0)
            this.createTilesArray(this.size);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate()
    {
        this.setToStorage(this.state.tiles,this.state.shortcuts,this.state.folders,this.state.settings,this.state.notes);
        if(!this.state.updateLocalStorage) this.setState({notes:JSON.parse(localStorage.getItem("notes")),updateLocalStorage:true});
    }

    render()
    {
        const tileList = this.state.tiles.map((e)=>{
            let folder = e.hasFolder ? {...this.state.folders[e.folderId]} : {};
            if(e.hasFolder)
                folder.shortcuts = folder.shortcuts.map((e)=>typeof e === "number" ? this.state.shortcuts[e] : e);

            return <Tile 
                key={e.id} 
                id={e.id}
                size={this.size} 
                height={this.state.tileHeight}
                width={this.state.tileWidth}
                hasShortcut={e.hasShortcut}
                hasFolder={e.hasFolder}
                isGrabbed={this.state.isGrabbed} 
                backgroundColor={this.state.settings.tilesColor}
                shortcut={e.hasShortcut ? this.state.shortcuts[e.shortcutId]:{}}
                folder={folder}
                headerHeight={this.state.headerheight}
                changeTile={()=>this.changeTile(e.id,null)}
                setDropShortcutId={
                    (inFolder,id,autoChangeTile)=>
                    this.setDropShortcutId((e.hasShortcut ? e.shortcutId : e.folderId),e.id,inFolder,id,autoChangeTile)
                } 
                setGrabbed={(e)=>this.setGrabbed(e)}
                setEditData={(id,isShortcut) => this.setState({editShortcutId:id,editShortcutForm:isShortcut,editFolderForm:!isShortcut,editNoteForm:false})}
            />
        });

        const notes = this.state.notes.map((e)=>{
            return <Note
                key={e.id} 
                note={{...e}}
                changePosition={(x,y)=>this.changeNotePosition(x,y,e.id)}
                changeOpened={(opened)=>this.changeNoteOpened(opened,e.id)}
                setZIndex={()=>this.setNotesZIndex(e.id)}
                setSize={(width,height)=>this.setNoteSize(width,height,e.id)}
                editNote={()=>this.setState({editShortcutId:e.id,editShortcutForm:false,editFolderForm:false,editNoteForm:true})}
                deleteNote={()=>this.deleteNote(e.id)}
                headerHeight={this.state.headerheight}
            />
        })

        return(
            <main ref={this.main} style={{
                height:(window.innerHeight)+"px", 
                maxHeight:(window.innerHeight)+"px"
                }}>
                <header style={{
                    background: this.state.settings.headerColor,
                    height: this.state.headerheight
                }}>
                    <h1>Notecut</h1>

                    <div id="addShortcut" onClick={this.showShortcutForm}>
                        <p className="subText">Add Shortcut</p>
                    </div>

                    <div id="addFolder" onClick={this.showFolderForm}>
                        <p className="subText">Add Folder</p>
                    </div>

                    <div id="addNote" onClick={this.showNoteForm}>
                        <p className="subText">Add Note</p>
                    </div>

                    <div id="settings" onClick={this.showSettings}>
                        <img src={settingsImg}/>
                    </div>
                </header>

                <div style={{width:60+"%", position:"absolute", left:50+"%", top:this.state.headerheight+25+"px", transform:"translate(-50%,-0%)", zIndex:10}}>
                    {this.state.settings.showSearchBar 
                        && <SearchBar 
                            newTab={this.state.settings.newTab} 
                            engine={this.state.settings.searchEngine}
                            findShortcuts={this.state.settings.findShortcuts}
                            shortcuts={this.state.shortcuts}
                    />}
                </div>

                {!(this.state.settings.separateNotes && this.state.settings.displayNotes) && <div className="borderBox" style={{
                    background: (this.state.settings.animate ? "0% 0% / 300% 300% " : "0% 0% / 100% 100% ") + this.state.settings.borderColor,
                    animation: this.state.settings.animate ? "animatedgradient 10s linear alternate infinite" : "none",
                    height: (window.innerWidth <= 600 ? "auto" : "644px")
                }}>
                    <div id="tiles" style={{
                        height:(window.innerWidth <= 600 ? "auto" : "644px"), 
                        width:(this.state.tilesWindowWidth)+"px",
                        background: this.state.settings.tilesColor
                    }}>
                        {tileList}
                    </div>
                </div>}

                {
                    (this.state.showShortcutForm || this.state.editShortcutForm) && 
                    <ShortcutForm 
                        addShortcut = {(name,link,note,color)=>this.addShortcut(name,link,note,color)}
                        cancel = {()=>this.setState({showShortcutForm:false})}
                        shortcut = {this.state.editShortcutForm ? this.state.shortcuts[this.state.editShortcutId] : {
                            id:-1,
                            name: "",
                            link: "",
                            note: "",
                            color: "#000000",
                        }}
                        editShortcut = {(name,link,desc,color) => this.editShortcut(name,link,desc,color)}
                    />
                }
                {
                    (this.state.showFolderForm || this.state.editFolderForm) && 
                    <FolderForm 
                        addFolder = {(name,note,color)=>this.addFolder(name,note,color)}
                        cancel = {()=>this.setState({showFolderForm:false})}
                        folder = {this.state.editFolderForm ? this.state.folders[this.state.editShortcutId] : {
                            id:-1,
                            name: "",
                            note: "",
                            color: "#000000",
                        }}
                        editFolder = {(name,desc,color) => this.editFolder(name,desc,color)}
                    />
                }

                {
                    (this.state.showNoteForm || this.state.editNoteForm) && 
                    <NoteForm 
                        addNote = {(name,note,color)=>this.addNote(name,note,color)}
                        cancel = {()=>this.setState({showNoteForm:false})}
                        note = {this.state.editNoteForm ? this.state.notes[this.state.editShortcutId] : {
                            id:-1,
                            name: "",
                            note: "",
                            color: "#000000",
                        }}
                        editNote = {(name,note,color) => this.editNote(name,note,color)}
                    />
                }

                {
                    this.state.showSettings && 
                    <Settings 
                        cancel = {()=>this.setState({showSettings:false})}
                        saveSettings = {(settings)=>this.setState({settings:settings,showSettings:false})}
                        headerColor = {this.state.settings.headerColor}
                        contentColor = {this.state.settings.contentColor}
                        tilesColor = {this.state.settings.tilesColor}
                        borderColor = {this.state.settings.borderColor}
                        animate = {this.state.settings.animate}

                        showSearchBar = {this.state.settings.showSearchBar}
                        searchEngine = {this.state.settings.searchEngine}
                        newTab = {this.state.settings.newTab}
                        findShortcuts = {this.state.settings.findShortcuts}
                        separateNotes = {this.state.settings.separateNotes}
                        displayNotesOpen = {this.state.settings.displayNotesOpen}
                        displayNotes = {this.state.settings.displayNotes}
                    />
                }

                {this.state.settings.displayNotes && notes}

                <div 
                    className={"noFreeSpace" + (this.state.noFreeSpace ? " show" : "")} 
                    onTransitionEnd={()=>this.setState({noFreeSpace:false})}
                >
                    <p>There is no empty tile!</p>
                </div>

                <div className="noteDisplay" style={{
                    height:(this.state.settings.displayNotesOpen?(!this.state.settings.separateNotes ? 60 : 100):20)+"px"
                }}>
                    <p onClick={()=>{
                        let newSettings = this.state.settings;
                        newSettings.displayNotesOpen = !newSettings.displayNotesOpen;
                        this.setState({settings: newSettings});    
                    }}>{this.state.settings.displayNotesOpen?"▲":"▼"}</p>
                    {!this.state.settings.separateNotes 
                    ? <div style={{
                        height:50+"px",
                        width:150+"px",
                        position:"relative",
                        left:50+"%",
                        transform:"translate(-50%,25%)",
                        textAlign:"center"
                    }}>
                        <label style={{paddingLeft:10+"px", color:"white"}}>Show Notes</label>
                        <input type="checkbox" style={{width:30+"px"}} defaultChecked={this.state.settings.displayNotes} checked={this.state.settings.displayNotes} onChange={(e)=>{
                            let newSettings = this.state.settings;
                            newSettings.displayNotes = e.target.checked;
                            this.setState({settings: newSettings});
                        }}/>
                    </div> 
                    : <div style={{height:100+"px", width:150+"px", fontSize:20+"px"}}>
                        <p className={!this.state.settings.displayNotes ? "selected" : ""} style={{width:100+"%", padding:"10px 0"}} onClick={()=>{
                            let newSettings = this.state.settings;
                            newSettings.displayNotes = false;
                            this.setState({settings: newSettings});  
                        }}>Shortcuts</p>

                        <p className={this.state.settings.displayNotes ? "selected" : ""} style={{width:100+"%", padding:"10px 0"}} onClick={()=>{
                            let newSettings = this.state.settings;
                            newSettings.displayNotes = true;
                            this.setState({settings: newSettings});  
                        }}>Notes</p>
                    </div>}
                </div>

                <style>
                    {`body{
                        background: ${this.state.settings.contentColor};
                    }

                    @keyframes animatedgradient {
                        0% {
                            background-position: 0% ;
                        }
                        100% {
                            background-position: 100%;
                        }
                    }`}
                </style>
            </main>
        )
    }

}
export default App;