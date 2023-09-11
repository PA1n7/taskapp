//Definitely forgot to comment this section but I aint gonna do it

let daySquares = document.getElementById("day-squares")
let date = new Date()
let dpm = {0: 31, 1:28, 2:31, 3:30, 4:31, 5:30, 6:31, 7:31, 8:30, 9:31, 10:30, 11:31}
start = date.getDay()-(date.getDate()%7-1)
if (start < 0){start = 7+start}
console.log(date.getDate())
console.log(date.getDay())
let currMonth = date.getMonth()
let currYear = date.getFullYear()
awaiting =false
let date_info = {}
let currDate;
let todo = "";
let submit_code = ""
let response_func;
let tasks;
let itemTODO = [];
let expectedDay;
let editing = false;
let checkChange;
let taskArr = [];

//Just general functions

function choice(arr){
    return (arr[(Math.floor(Math.random() * arr.length))]);
}

function remove_undef(arr){
    let temp_arr = []
    for(let i = 0; i<arr.length; i++){
        if(arr[i]!=undefined){temp_arr.push(arr[i])}
    }
    return temp_arr
}

function setMonth(start, month, year){
    awaiting = false
    let day = 1
    daySquares.innerHTML = ""
    console.log(start)
    console.log(month)
    console.log(year)
    for (let n = 0; n<6; n++){
        let dayRow = document.createElement("div")
        dayRow.className = "day-row"
        for(let i = 0; i<7; i++){
            let dayDiv = document.createElement("div")
            let tempDay = day
            currDate = `${tempDay}/${month+1}/${year}`
            if ((day<=dpm[month] && day != 1) || (day== 1 && start-1 == i)){
                dayDiv.id = currDate
                if(month == date.getMonth() && year == date.getFullYear() && day == date.getDate()){dayDiv.classList.add("current-day")}
                dayDiv.innerHTML = day+"<br>";
                dayDiv.classList.add("hoverable-day");
                awaiting = false
                window.api.send("toMain", `read ${tempDay}/${month+1}/${year}`)
                dayDiv.onclick = ()=>{
                    awaiting = true
                    expectedDay = `${tempDay}/${month+1}/${year}`
                    window.api.send("toMain", `read ${tempDay}/${month+1}/${year}`)
                    console.log("sent command "+`read ${tempDay}/${month+1}/${year}`)
                }
            }
            dayDiv.classList.add("day")
            dayRow.appendChild(dayDiv)
            if (day == 1 && start-1 == i){
                day++;
            }else{
                if(day!=1){
                    day++
                }
            }
        }
        daySquares.appendChild(dayRow)
    }
    setTimeout(()=>{
        let TempKeys = Object.keys(date_info)
        console.log(date_info)
        for (let i= 0; i<TempKeys.length; i++){
            let tempData = date_info[TempKeys[i]]
            if(tempData!=undefined){
                for(let z = 0; z<tempData.length; z++){
                    let tempButton = document.createElement("div")
                    tempButton.classList.add("colorNote")
                    tempButton.style.backgroundColor = tempData[z]["color"]
                    let tempNote = document.createElement("div")
                    tempNote.classList.add("hiddenNote")
                    tempNote.innerText = tempData[z]["Title"]
                    tempButton.appendChild(tempNote)
                    document.getElementById(TempKeys[i]).appendChild(tempButton)
                }
            }
        }
        window.onresize()
    }, 500) //Have to make loading screen
    let dateInfo = document.getElementById("datemonth")
    dateInfo.innerText = year + " / " + (month+1)
}

setMonth(start, currMonth, currYear);

document.getElementById("prevMonth").onclick = ()=>{
    if (currMonth == 0){currMonth = 11; currYear--}else{currMonth--}
    let daysBack = dpm[currMonth]%7
    if(start-daysBack <= 0){start = 7+(start-daysBack)}else{start=start-daysBack}
    setMonth(start, currMonth, currYear);
    window.api.send("todoGet", "get todo")
}

document.getElementById("nextMonth").onclick = ()=>{
    let daysFw = dpm[currMonth]%7
    if (daysFw+start > 7){start = (daysFw+start)-7}else{start = daysFw + start}
    if (currMonth == 11){currMonth = 0; currYear++}else{currMonth++}
    setMonth(start, currMonth, currYear);
    window.api.send("todoGet", "get todo")
}

function menuAlert(text, stack = true){
    let menuContent = document.getElementsByClassName("menu-content")[0]
    if(!stack){menuContent.innerHTML = ""}
    let textEle = document.createElement("div")
    textEle.classList.add("menu-item")
    textEle.onclick = ()=>{
        if(text["id"]>=0){
            showOptns(expectedDay, text["id"])
        }
    }
    let noteHead = document.createElement("div")
    noteHead.classList.add("noteHead")
    let title = document.createElement("h1")
    title.innerText = text["Title"]
    let colored_circle = document.createElement("div")
    colored_circle.classList.add("circle")
    colored_circle.style.backgroundColor = text["color"]
    noteHead.appendChild(title)
    noteHead.appendChild(colored_circle)
    textEle.appendChild(noteHead)
    let inText = document.createElement("p")
    inText.innerText = text["text"]
    textEle.appendChild(inText)
    menuContent.appendChild(textEle)
    showMenu()
}

{
    let mE = document.getElementsByClassName("menuEssentials")[0]
    mE.onclick = hideMenu
}

function hideMenu (){
    let menuItem = document.getElementById("menu")
    menuItem.style.right = "-100%"
    let bM = document.getElementById("bMenu")
    bM.style.opacity = "1"
}

function showMenu(){
    let menuItem = document.getElementById("menu")
    menuItem.style.right = "0%"
    let bM = document.getElementById("bMenu")
    bM.style.opacity = "0"
}

{
    let bM = document.getElementById("bMenu")
    bM.onclick = ()=>{
        showMenu()
    }
}

window.api.receive("fromMain", (data)=>{
    if(data[0] == undefined || data[0].length == 0){
        if(awaiting){menuAlert({"Title":"There's no info saved on this day...", "color":"none", "text":"", "id":-1}, false)};
        return
    }
    if (!awaiting){
        date_info[data[1]] = data[0]
        return
    }
    for(let i = 0; i<data[0].length; i++){
        if (i == 0){menuAlert(data[0][i], false)}else{menuAlert(data[0][i])}
    }
})

window.api.receive("todoSend", (data)=>{
    for(let i = 0; i<taskArr.length; i++){
        taskArr[i].remove()
    }
    let todoDIV = document.getElementsByClassName("TODO")[0]
    for(let i = 0; i<itemTODO.length; i++){
        itemTODO[i].remove()
    }
    itemTODO = []
    tasks = data;
    todo = data.toString()
    for(let i = 0; i<data.length; i++){
        let NewEntry = document.createElement("div")
        NewEntry.classList.add("todoItem")
        let text = document.createElement("p")
        text.innerText = data[i]["name"]
        let cButt = document.createElement("div")
        cButt.classList.add("todoBtn")
        cButt.onclick = ()=>{
            tasks[i] = undefined
            cButt.parentElement.remove()
            let returnTasks = remove_undef(tasks)
            window.api.send("todoGet", "send todo "+JSON.stringify(returnTasks))
            window.api.send("todoGet", "get todo")
        }
        NewEntry.appendChild(text)
        NewEntry.appendChild(cButt)
        todoDIV.appendChild(NewEntry)
        itemTODO.push(NewEntry)
        if(data[i]["date"] != ""){
            let todoDate = data[i]["date"].split("/")
            if(todoDate[1] == currMonth+1 && todoDate[2] == currYear){
                setTimeout(()=>{
                    let obj = document.getElementById(data[i]["date"])
                    let newTask = document.createElement("div")
                    newTask.classList.add("task")
                    newTask.innerText = data[i]["name"]
                    taskArr.push(newTask)
                    obj.appendChild(newTask)
                }, 800)
            }
        }
    }
})

window.api.send("todoGet", "get todo")

window.api.receive("textSend", (data)=>{
    let noteArea = document.getElementById("noteArea")
    noteArea.value = data
})

window.api.send("textGet", "get")

window.onresize = ()=>{
    console.log("resize")
    let hidden = document.getElementsByClassName("hiddenNote")
    for(let i = 0; i<hidden.length; i++){
        hidden[i].style.transform = "translateY(" + hidden[i].parentElement.clientHeight + "px)"
        console.log(hidden[i])
    }
}

await_response = ()=>{x = setInterval(()=>{
    if (submit_code != ""){
        response_func(submit_code)
        submit_code = ""
        response_func = undefined
        hide_ask()
        clearInterval(x)
    }
}, 10)}

function hide_ask(){
    document.getElementsByClassName("bg")[0].style.display ="none"
}

function ask(resFunc){
    response_func = resFunc
    let button = document.getElementsByClassName("submitText")[0]
    submit_code = ""
    button.onclick = ()=>{
        submit_code = document.getElementById("askText").value
    }
    document.getElementsByClassName("bg")[0].style.display = "block"
    let exit = document.getElementById("exitMenus")
    exit.style.display = "block"
    await_response()
}

function parseDate(val){
    let arr = val.split("-")
    if(arr[2].charAt(0) == 0){
        arr[2] = arr[2].charAt(1)
    }
    if(arr[1].charAt(0) == 0){
        arr[1] = arr[1].charAt(1)
    }
    return `${arr[2]}/${arr[1]}/${arr[0]}`
}

function add_todo(text){
    document.getElementById("askText").value = ""
    let date = "";
    if(document.getElementById("todoCalendar").checked){
        date = parseDate(document.getElementById("todoDate").value)
    }
    document.getElementById("todoCalendar").checked = false;
    document.getElementById("todoDate").value = ""
    tasks.push({"name":text, "date":date})
    let returnTasks = remove_undef(tasks)
    window.api.send("todoGet", "send todo "+JSON.stringify(returnTasks))
    window.api.send("todoGet", "get todo")
    customAlert("Added Item to todo!", false)
    let exit = document.getElementById("exitMenus")
    exit.style.display = "none"
}

function createNewEvent(){
    let newtitle = document.querySelector(".inputEvents div input[type=text]").value
    let color = document.querySelector(".inputEvents div input[type=color]").value
    let desc = document.querySelector(".inputEvents textarea").value
    if(editing){
        if (newtitle != ""){
            let hD = document.getElementsByClassName("hiddenData")[0].innerText
            editEvent(hD.split(" ")[0], hD.split(" ")[1], newtitle, color, desc)
            editing = false
        }else{
            customAlert("You have to set a title")
        }
        return
    }
    if(expectedDay){
        if (newtitle != ""){
            document.querySelector(".inputEvents div input[type=text]").value = ""
            document.querySelector(".inputEvents div input[type=color]").value = "#000000"
            document.querySelector(".inputEvents textarea").value = ""
            console.log(date_info[expectedDay])
            if(date_info[expectedDay] == [] || date_info[expectedDay] == undefined){
                let nextId = 0
            }else{
                let nextId = date_info[expectedDay][date_info[expectedDay].length-1]["id"]+1
            }
            if (Object.keys(date_info).includes(expectedDay)){
                date_info[expectedDay].push({
                    "Title":newtitle,
                    "color":color,
                    "text":desc,
                    "id":nextId
                })
            }else{
                date_info[expectedDay] = [{
                    "Title":newtitle,
                    "color":color,
                    "text":desc,
                    "id":0
                }]
            }
            console.log(date_info)
            document.getElementsByClassName("addEvent")[0].style.display = "none"
            window.api.send("toMain", `send ${JSON.stringify(date_info)}`)
            customAlert("Added Event to calendar!", false)
            setMonth(start, currMonth, currYear);
            window.api.send("todoGet", "get todo");
            let exit = document.getElementById("exitMenus")
            exit.style.display = "none"
        }else{
            customAlert("Put something in the title of the event!")
        }
    }else{
        customAlert("ERROR No expected day requested!")
    }
}

function openEventTab(){
    document.getElementsByClassName("addEvent")[0].style.display = "block"
    let menuItem = document.getElementById("menu")
    menuItem.style.right = "-100%"
    let bM = document.getElementById("bMenu")
    bM.style.opacity = "1"
    let exit = document.getElementById("exitMenus")
    exit.style.display = "block"
}

function customAlert(txt, bad=true){
    let alertObj = document.getElementsByClassName("alert")[0]
    if(bad){
        alertObj.style.backgroundColor = "#740000"
    }else{
        alertObj.style.backgroundColor = "#007400"
    }
    alertObj.innerText = txt
    alertObj.style.top = "3.5%"
    setTimeout(()=>{
        alertObj.style.top = "-100%"
    }, 3000)
}

{
    let exit = document.getElementById("exitMenus")
    exit.onclick = ()=>{
        let bgs = document.getElementsByClassName("bg")
        for(let i = 0; i<bgs.length; i++){
            bgs[i].style.display = "none"
        }
        exit.style.display = "none"
    }
}

function deleteEvent(dat, id){
    for(let i = 0; i<date_info[dat].length; i++){
        if (date_info[dat][i]["id"] == id){
            date_info[dat].splice(i, 1)
            break
        }
    }
    window.api.send("toMain", `send ${JSON.stringify(date_info)}`)
    customAlert("Deleted Event from calendar!", false)
    setMonth(start, currMonth, currYear);
    let exit = document.getElementById("exitMenus")
    exit.style.display = "none"
    let optns = document.getElementsByClassName("editMenu")[0]
    optns.style.display = "none"
}

function simplerDeleteEvent(){
    let hD = document.getElementsByClassName("hiddenData")[0].innerText
    deleteEvent(hD.split(" ")[0], hD.split(" ")[1])
}

function editEvent(dat, id, title, color, text){
    for(let i = 0; i<date_info[dat].length; i++){
        if (date_info[dat][i]["id"] == id){
            date_info[dat][i] = {
                "Title":title,
                "color":color,
                "text":text,
                "id":id
            }
        }
        break
    }
    document.getElementsByClassName("addEvent")[0].style.display = "none"
    window.api.send("toMain", `send ${JSON.stringify(date_info)}`)
    customAlert("Edited Event in calendar!", false)
    setMonth(start, currMonth, currYear);
    let exit = document.getElementById("exitMenus")
    exit.style.display = "none"
}

function showOptns(date, id){
    let exit = document.getElementById("exitMenus")
    exit.style.display = "block"
    let optns = document.getElementsByClassName("editMenu")[0]
    optns.style.display = "block"
    let hD = document.getElementsByClassName("hiddenData")[0]
    hD.innerText = `${date} ${id}`
    hideMenu()
}

function openEditMenu(){
    editing = true
    let hD = document.getElementsByClassName("hiddenData")[0].innerText
    let optns = document.getElementsByClassName("editMenu")[0]
    optns.style.display = "none"
    let dat = hD.split(" ")[0]
    for(let i = 0; i<date_info[dat].length; i++){
        if (date_info[dat][i]["id"] == hD.split(" ")[1]){
            dayInfo = date_info[dat][i]
            break
        }
    }
    document.querySelector(".inputEvents div input[type=text]").value = dayInfo["Title"]
    document.querySelector(".inputEvents div input[type=color]").value = dayInfo["color"]
    document.querySelector(".inputEvents textarea").value = dayInfo["text"]
    openEventTab()
}

{
    let noteArea = document.querySelector("#noteArea")
    let prevText = ""
    noteArea.addEventListener("focus", ()=>{
        checkChange = setInterval(()=>{
            if(prevText != noteArea.value){
                prevText = noteArea.value
                window.api.send("textGet", "send " + prevText)
            }
            if(!noteArea === document.activeElement){
                console.log("lost focus over text area!")
                window.api.send("textGet", "get")
                clearInterval(checkChange)
            }
        }, 2000)
    })
}

//THEME

window.api.receive("themeSend", (data)=>{
    let themeArr = JSON.parse(data)
    document.getElementsByClassName("full-bg")[0].innerHTML = ""
    if(themeArr["background"].split(".")[1]=="mp4"){
        let videoElem = document.createElement("video")
        videoElem.src = themeArr["background"]
        console.log(videoElem)
        videoElem.muted = true;
        videoElem.controls = false;
        videoElem.loop = true;
        videoElem.autoplay = true;
        document.getElementsByClassName("full-bg")[0].appendChild(videoElem)
    }else{
        document.getElementsByClassName("full-bg")[0].style.backgroundImage = `url("${themeArr["background"]}")`
    }
    var r = document.querySelector(":root")
    r.style.setProperty("--color", themeArr["color"])
    r.style.setProperty("--bg", themeArr["bg"])
    r.style.setProperty("--darkMain", themeArr["dM"])
    r.style.setProperty("--lightMain", themeArr["lM"])
    r.style.setProperty("--back", themeArr["back"])
    r.style.setProperty("--contrast", themeArr["contrast"])
    r.style.setProperty("--p1", themeArr["p1"])
    r.style.setProperty("--p2", themeArr["p2"])
    r.style.setProperty("--p3", themeArr["p3"])
    r.style.setProperty("--p4", themeArr["p4"])
    r.style.setProperty("--lp1", themeArr["lp1"])
    r.style.setProperty("--lp2", themeArr["lp2"])
    r.style.setProperty("--lp3", themeArr["lp3"])
    r.style.setProperty("--lp4", themeArr["lp4"])
    r.style.setProperty("--font", themeArr["font"])
    document.getElementById("currTheme").value = themeArr["name"]
})

window.api.receive("themes", (data)=>{
    for(let i = 0; i<data.length; i++){
        let optn = document.createElement("option")
        optn.innerText = data[i]
        optn.value = data[i]
        document.getElementById("currTheme").appendChild(optn)
    }
})

window.api.send("theme", "get")

function showSettings(){
    let tempElem = document.getElementsByClassName("themeChange")[0]
    if(tempElem.style.display == "none"){
        tempElem.style.display = "block"
    }else{
        tempElem.style.display = "none"
    }
    window.api.send("theme", "themes")
}

document.getElementById("currTheme").onchange = (ev)=>{
    window.api.send("theme", "change "+document.getElementById("currTheme").value)
    window.api.send("theme", "get")
}