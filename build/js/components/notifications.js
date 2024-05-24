import { inspectionArea } from "./overview.js";

export function notifyUser(opt, title ="", parentElement=inspectionArea){
    const notificationCard = createNotification(opt, title);
    displayNotification(notificationCard, parentElement);
}

function createNotification(opt, title){
    let msgError;
    let id;
    let notiClass;
    switch(opt){
        case 1:
            msgError = "Select at least one state.";
            id = "eventNoStateError";
            notiClass = 0;
            break;
        case 2:
            msgError = "The name has already been used before.";
            id = "eventInvalidName";
            notiClass = 0;
            break;
        case 3:
            msgError = "Assign a valid name for the event.";
            id = "eventNoName";
            notiClass = 0;
            break;
        case 4:
            msgError = `Select the type of motion primitive.`;
            id = "eventNoType";
            notiClass = 0;
            break;
        case 5:
            msgError = `${title}-Successfully added.`;
            id = `${title}eventSuccess`;
            notiClass = 1;
            break;
        case 6:
            msgError = `Select the area corresponding to the state.`;
            id = "stateNoArea";
            notiClass = 0;
            break;
        case 7:
            msgError = `Assign a valid name for the state.`;
            id = "noNameState";
            notiClass = 0;
            break;
        case 8:
            msgError = `The selected name has been used previously. Use another.`;
            id = "usedNameError";
            notiClass = 0;
            break;
        case 9:
            msgError = `${title}-Successfully added`;
            id = `${title}stateSuccess`;
            notiClass = 1;
            break;
        case 10:
            msgError = `The selected color has been used previously. Try another.`;
            id = `usedColorError`;
            notiClass = 0;
            break;
        case 11:
            msgError = `Create at least one status to access this section`;
            id = `zeroStatesError`;
            notiClass = 0;
            break;
        case 12:
            msgError = `${title}-Updated successfully`;
            id = `editStateSuccess`;
            notiClass = 1;
            break;
        case 13:
            msgError = `Create at least one event`;
            id = `noEventScript`;
            notiClass = 0;
            break;
    }
    const temp = document.createElement("div");
    temp.classList.add("notification__card"); 
    temp.classList.add(`${notiClass ? "user__success" : "user__error"}`); 
    temp.id = id; 
    const errorContent = `  <div class="notification__body">
                                <div class="notification__data">
                                    <h3>${notiClass ? "Done" : "Error"}</h3>
                                    <p>${msgError}</p>
                                </div>
                                <div class="notification__close-button">
                                    <img src="build/img/close.svg"></img>
                                </div>
                            </div>
                            <div class="notification__loading-bar"></div>`;
    temp.innerHTML = errorContent;
    temp.querySelector(".notification__close-button").addEventListener("click", removeError);
    return temp;
}

function displayNotification(card, parentElement){
    if(document.getElementById(card.id)){
        return 0;
    }

    if (card.classList[1] === "user__success"){
        document.querySelectorAll(".user__error").forEach(x=>{x.remove()});
    }

    let msg = document.querySelector(".user__success");
    if (msg){
        msg.remove();
    }
    let notificationPanel = parentElement.querySelector(".notification-panel");
    if (!notificationPanel){
        notificationPanel = document.createElement("div");
        notificationPanel.classList.add("notification-panel");
        parentElement.appendChild(notificationPanel);
    }
    if ([...notificationPanel.childNodes].length === 0){
        notificationPanel.appendChild(card);
    }
    notificationPanel.insertBefore(card, notificationPanel.children.item(0));
    const bar = card.querySelector(".notification__loading-bar");
    loadingBarAnimation(bar);
}

function removeError(){
    this.parentElement.parentElement.remove();
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadingBarAnimation(bar) {
    for (let i = 1000; i >= 0; i--) {
        bar.style.width = `${i/10}%`;
        await sleep(0.5);
    }
    bar.parentElement.remove();
}