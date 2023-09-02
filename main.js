console.log("opening window...")
const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs")

let win;

async function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences:{
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload:path.join(__dirname, "preload.js")
        }
    })
    win.webContents.openDevTools()
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
        fs.readFile("saved_data.json", (err, fileData)=>{
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
})

ipcMain.on("todoGet", (event, args)=>{
    let data = args.split(" ")
    if(data[0]=="get"){
        if(data[1]=="todo"){
            fs.readFile("todo.json", (err, fileData)=>{
                if(err)throw err
                let jsonData = JSON.parse(fileData.toString())
                win.webContents.send("todoSend", jsonData)
            })
        }
    }
    if(data[0]=="send"){
        if(data[1]=="todo"){
            console.log("writing file...")
            console.log('["'+data.slice(2).join(" ").split(",").join('","')+'"]')
            fs.writeFile("todo.json", '["'+data.slice(2).join(" ").split(",").join('","')+'"]', (err)=>{if(err)throw err})
            console.log("File written!")
        }
    }
})