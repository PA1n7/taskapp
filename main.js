console.log("opening window...")
const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs")

let win;

let saveDirectory = __dirname.split("\\")[0]+"/CashTrackSave"

let absPath = __dirname.split("\\")
let cut;

for(let i = 0; i<absPath.length; i++){
    if(absPath[i] == "cashtrack"){cut = i}
}

process.chdir(__dirname.split("\\").slice(0, cut+1).join("/"))

console.log(`Save files at ${saveDirectory}`)

{
    //Checking for first time launch
    if(!fs.existsSync(saveDirectory)){
        console.log("No save files detected")
        fs.mkdir(saveDirectory, (err)=>{if(err)throw err})
        fs.appendFile(saveDirectory + "/saved_data.json", "{}", (err)=>{if(err)throw err})
        fs.appendFile(saveDirectory + "/settings.json", '{"Theme":"Default"}', (err)=>{if(err)throw err})
        fs.appendFile(saveDirectory + "/todo.json", "[]", (err)=>{if(err)throw err})
        fs.appendFile(saveDirectory + "/notes.txt", "", (err)=>{if(err)throw err})
        fs.rename("Themes", saveDirectory + "/Themes", (err)=>{if(err)throw err})
    }
}

async function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon:"images/notebook-white.png",
        webPreferences:{
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload:path.join(__dirname, "preload.js")
        }
    })
    win.loadFile("index.html")
}

app.on("ready", createWindow)

app.on('window-all-closed', () => {
    console.log("app was closed.")
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("toMain", (event, args)=>{
    let data = args.split(" ")
    // console.log("command received "+args)
    if (data[0]=="read"){
        fs.readFile(saveDirectory+"/saved_data.json", (err, fileData)=>{
            if(err)throw err
            let jsonData = JSON.parse(fileData.toString())
            // console.log("Read file:")
            // console.log(fileData.toString() + "\nEND")
            // console.log("Finding for index "+data[1])
            let response = jsonData[data[1].toString()]
            // console.log(`response: ${response}`)
            // console.log("Returning response...")
            win.webContents.send("fromMain", [response, data[1]])
        })
    }
    if(data[0] == "send"){
        console.log("sending info...")
        let final_res = (data.slice(1).join(" "))
        console.log("writing file...")
        fs.writeFile(saveDirectory+"/saved_data.json", final_res, (err)=>{if(err){throw err}})
        console.log("information succesfully saved!")
    }
})

ipcMain.on("todoGet", (event, args)=>{
    let data = args.split(" ")
    if(data[0]=="get"){
        if(data[1]=="todo"){
            fs.readFile(saveDirectory+"/todo.json", (err, fileData)=>{
                if(err)throw err
                let jsonData = JSON.parse(fileData.toString())
                win.webContents.send("todoSend", jsonData)
            })
        }
    }
    if(data[0]=="send"){
        if(data[1]=="todo"){
            console.log("writing file...")
            let final_res = data.slice(2).join(" ")
            console.log(final_res)
            fs.writeFile(saveDirectory+"/todo.json", final_res, (err)=>{if(err)throw err})
            console.log("File written!")
        }
    }
})

ipcMain.on("textGet", (event, args)=>{
    let data = args.split(" ")
    if(data[0] == "get"){
        fs.readFile(saveDirectory+"/notes.txt", (err, fileData)=>{
            if(err)throw err
            win.webContents.send("textSend", fileData.toString())
        })
    }
    if(data[0] == "send"){
        fs.writeFile(saveDirectory+"/notes.txt", data.slice(1).join(" "), (err)=>{if(err){throw err}})
        console.log("saved text file data!")
    }
})

ipcMain.on("theme", (event, args)=>{
    let data = args.split(" ")
    if(data[0] == "get"){
        fs.readFile(saveDirectory+"/settings.json", (err, fileData)=>{
            if(err)throw err
            let theme = JSON.parse(fileData.toString())["Theme"]
            console.log(theme)
            fs.readFile(saveDirectory+"/Themes/"+theme+"/colors.json", (err, themeData)=>{
                if(err)throw err
                themeData = JSON.parse(themeData.toString())
                themeData["background"] = saveDirectory + "/" + themeData["background"]
                console.log(themeData)
                win.webContents.send("themeSend", JSON.stringify(themeData))
            })
        })
    }
    if(data[0] == "themes"){
        fs.readdir(saveDirectory+"/Themes", (err, files)=>{
            if (err)throw err
            win.webContents.send("themes", files)
        })
    }
    if(data[0] == "change"){
        fs.readFile(saveDirectory+"/settings.json", (err, fileData)=>{
            if(err)throw err
            let tempChange = JSON.parse(fileData)
            tempChange["Theme"] = data[1]
            fs.writeFile(saveDirectory+"/settings.json", JSON.stringify(tempChange), (err)=>{if(err)throw err})
        })
    }
})