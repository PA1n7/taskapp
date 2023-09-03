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
        let colors = ["blue", "green", "yellow", "red", "white", "black"]
        let TempKeys = Object.keys(date_info)
        for (let i= 0; i<TempKeys.length; i++){
            let tempData = date_info[TempKeys[i]]
            if(tempData!=undefined){
                for(let z = 0; z<tempData.length; z++){
                    let tempButton = document.createElement("div")
                    tempButton.classList.add("colorNote")
                    tempButton.style.backgroundColor = choice(colors)
                    let tempNote = document.createElement("div")
                    tempNote.classList.add("hiddenNote")
                    tempNote.innerText = tempData[z]
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
}

document.getElementById("nextMonth").onclick = ()=>{
    let daysFw = dpm[currMonth]%7
    if (daysFw+start > 7){start = (daysFw+start)-7}else{start = daysFw + start}
    if (currMonth == 11){currMonth = 0; currYear++}else{currMonth++}
    setMonth(start, currMonth, currYear);
}

function menuAlert(text, stack = true){
    let menuContent = document.getElementsByClassName("menu-content")[0]
    if(!stack){menuContent.innerHTML = ""}
    let textEle = document.createElement("div")
    textEle.classList.add("menu-item")
    textEle.innerText = text
    menuContent.appendChild(textEle)
    showMenu()
}

{
    let mE = document.getElementsByClassName("menuEssentials")[0]
    mE.onclick = ()=>{
        let menuItem = document.getElementById("menu")
        menuItem.style.right = "-100%"
        let bM = document.getElementById("bMenu")
        bM.style.opacity = "1"
    }
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

function choice(arr){
    return (arr[(Math.floor(Math.random() * arr.length))]);
}

window.api.receive("fromMain", (data)=>{
    if(data[0] == undefined){
        if(awaiting){menuAlert("There's no info saved on this day...", false)};
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
    let todoDIV = document.getElementsByClassName("TODO")[0]
    todo = data.toString()
    for(let i = 0; i<data.length; i++){
        let NewEntry = document.createElement("div")
        NewEntry.classList.add("todoItem")
        NewEntry.innerText = data[i];
        todoDIV.appendChild(NewEntry)
    }
})

window.api.send("todoGet", "get todo")

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
    await_response()
}
