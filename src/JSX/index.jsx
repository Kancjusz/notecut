import React, { Component, createRef } from "react";
import ShortcutForm from "./ShortcutForm";
import FolderForm from "./FolderForm";
import { showGrid,hideGrid } from "../Scripts/showGrid";
import Tile from "./Tile"
import "../CSS/indexStyle.css"

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

        let tilesDivWidth = this.getTilesDivWidth();

        this.state = {
            shortcuts:shortcuts,
            folders:folders,
            tiles:tiles,

            tileHeight:((window.innerHeight)*0.7)/8,
            tileWidth:tilesDivWidth/12,
            tilesWindowWidth:1920*0.5,

            showShortcutForm:false,
            showFolderForm:false,

            dropShortcutId:-1,
            ogTileId:-1,
            isGrabbed:false,
            isShortcut:false,
            inFolder:false,

            noFreeSpace:false,

            editShortcutId:-1,
            editShortcutForm:false,
            editFolderForm:false
        }

        this.addShortcut = this.addShortcut.bind(this);
        this.showShortcutForm = this.showShortcutForm.bind(this);
        this.showFolderForm = this.showFolderForm.bind(this);
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

        this.main = createRef();
    }

    showShortcutForm()
    {
        this.setState({
            showShortcutForm: !this.state.showShortcutForm,
            showFolderForm: false,
        });
    }

    showFolderForm()
    {
        this.setState({
            showFolderForm: !this.state.showFolderForm,
            showShortcutForm: false
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
                if(folder.shortcuts[i].id === shortcutId)
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
                let shortcuts = this.state.shortcuts;
                shortcuts[shortcutId] = null;

                let wasDeleted = false;
                let deleteModifier = 0;
                for(let i = 0; i < shortcuts.length;i++)
                {
                    if(shortcuts[i] == null)
                    {
                        shortcuts.splice(i,1);
                        i--;
                        wasDeleted = true;
                        deleteModifier++;
                        continue;
                    }

                    if(wasDeleted)
                    {
                        let oldId = shortcuts[i].id;
                        shortcuts[i].id = shortcuts[i].id - deleteModifier;
                        tiles[this.getTileIdByShortcutId(oldId)].shortcutId = shortcuts[i].id;
                    }
                }

                this.setState({
                    shortcuts:shortcuts,
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

                if(folders[folderId].shortcuts.length > 0)
                {
                    let shortcutsInFolder = folders[folderId].shortcuts;
                    for(let i=0;i<shortcuts.length;i++)
                    {
                        for(let j = 0;j < shortcutsInFolder.length;j++)
                        {
                            if(shortcuts[i].id === shortcutsInFolder[j].id)
                            {
                                shortcuts[i] = null;
                                break;
                            }
                        }
                    }
                }

                let tiles = this.state.tiles;

                let wasDeleted = false;
                let deleteModifier = 0;
                for(let i = 0; i < shortcuts.length;i++)
                {
                    if(shortcuts[i] == null)
                    {
                        shortcuts.splice(i,1);
                        i--;
                        wasDeleted = true;
                        deleteModifier++;
                        continue;
                    }

                    if(wasDeleted)
                    {
                        let oldId = shortcuts[i].id;
                        shortcuts[i].id = shortcuts[i].id - deleteModifier;
                        tiles[this.getTileIdByShortcutId(oldId)].shortcutId = shortcuts[i].id;
                    }
                }

                folders[folderId] = null;

                wasDeleted = false;
                deleteModifier = 0;
                for(let i = 0; i < folders.length;i++)
                {
                    if(folders[i] == null)
                    {
                        folders.splice(i,1);
                        i--;
                        wasDeleted = true;
                        deleteModifier++;
                        continue;
                    }

                    if(wasDeleted)
                    {
                        let oldId = folders[i].id;
                        folders[i].id = folders[i].id - deleteModifier;
                        tiles[this.getTileIdByFolderId(oldId)].folderId = folders[i].id;
                    }
                }

                this.setState({
                    tiles:tiles,
                    folders:folders,
                    shortcuts:shortcuts,
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


        let folders = this.state.folders;

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
                shortcuts = [...shortcuts,this.state.shortcuts[tiles[id].shortcutId]];

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

            if(folder.shortcuts.length > 0 &&
            folder.shortcuts[folder.shortcuts.length-1].id === this.state.shortcuts[shortcutId].id) 
                return;

            let shortcuts = folder.shortcuts;
            let shortcut = this.state.shortcuts[shortcutId];

            shortcuts = [...shortcuts,shortcut];

            folder.shortcuts = shortcuts;

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

        this.setState({
            tiles:tiles,
            dropShortcutId:-1,
            folders:folders,
            ogTileId:-1,
            inFolder: false
        });
    }

    setToStorage(tiles,shortcuts,folders)
    {
        localStorage.setItem("tiles",JSON.stringify(tiles));
        localStorage.setItem("shortcuts",JSON.stringify(shortcuts));
        localStorage.setItem("folders",JSON.stringify(folders));
    }

    getTilesDivWidth()
    {
        return window.innerWidth < 1920 * 0.5 ? window.innerWidth : 1920 * 0.5;
    }

    updateDimensions()
    {
        let tilesDivWidth = this.getTilesDivWidth();
        let tilesDivHeight = window.innerHeight*0.7;

        this.setState({ tileWidth: tilesDivWidth/12, tileHeight: (tilesDivHeight)/8, tilesWindowWidth: tilesDivWidth});
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
        this.setToStorage(this.state.tiles,this.state.shortcuts,this.state.folders);
    }

    render()
    {
        const tileList = this.state.tiles.map((e)=>{
            return <Tile 
                key={e.id} 
                id={e.id}
                size={this.size} 
                height={this.state.tileHeight}
                width={this.state.tileWidth}
                hasShortcut={e.hasShortcut}
                hasFolder={e.hasFolder}
                isGrabbed={this.state.isGrabbed} 
                shortcut={e.hasShortcut ? this.state.shortcuts[e.shortcutId]:{}}
                folder={e.hasFolder ? this.state.folders[e.folderId]:{}}
                changeTile={()=>this.changeTile(e.id,null)}
                setDropShortcutId={
                    (inFolder,id,autoChangeTile)=>
                    this.setDropShortcutId((e.hasShortcut ? e.shortcutId : e.folderId),e.id,inFolder,id,autoChangeTile)
                } 
                setGrabbed={(e)=>this.setGrabbed(e)}
                setEditData={(id,isShortcut) => this.setState({editShortcutId:id,editShortcutForm:isShortcut,editFolderForm:!isShortcut})}
            />
        });

        return(
            <main ref={this.main} style={{
                height:(window.innerHeight)+"px", 
                maxHeight:(window.innerHeight)+"px"
                }}>
                <header>
                    <h1>Notecut</h1>

                    <div id="addShortcut" onClick={this.showShortcutForm}>
                        <p>+</p>
                        <p className="subText">Dodaj Skrót</p>
                    </div>

                    <div id="addFolder" onClick={this.showFolderForm}>
                        <p>+</p>
                        <p className="subText">Dodaj Folder</p>
                    </div>
                </header>

                <div id="tiles" style={{height:(window.innerHeight*0.7)+"px", width:(this.state.tilesWindowWidth)+"px"}}>
                    {tileList}
                </div>

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

                <div 
                    className={"noFreeSpace" + (this.state.noFreeSpace ? " show" : "")} 
                    onTransitionEnd={()=>this.setState({noFreeSpace:false})}
                >
                    <p>Wszystkie miejsca są zapełnione</p>
                </div>
                
            </main>
        )
    }

}
export default App;