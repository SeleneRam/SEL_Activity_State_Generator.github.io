import { homeButton, rightButtons, discardButton,
        downloadButton } from "./buttons.js";

import { mainSpace, footer } from "./docStruct.js";

import { userImgElement } from "../pages/initialpage.js";

import { displayStatesWorkspace, deleteStates,
        deleteUsedColors, deleteUsedNames, states } from "../pages/statesworkspace.js";

import { displayEventsWorkSpace, deleteEvents,
        deleteUsedEventNames, events, usedEventNames } from "../pages/eventsworkspace.js";

import { notifyUser } from "./notifications.js";

import { summaryStateList, statesArea, $ } from "./workspace.js";

import { popUserTittle, popWarningUseless } from "./popMessages.js";

export const stateListViewer = document.createElement("div");
stateListViewer.classList.add("state-list-viewer");
stateListViewer.id = "state-list";

export const eventListViewer = document.createElement("div");
eventListViewer.classList.add("state-list-viewer");
eventListViewer.id = "event-list";

export const sectionsArea = document.createElement("div");
sectionsArea.classList.add("sections-area");

export const sectionsIndex = `<div class="sections-index">
                            <button id="states-button" class="section-button --active-button">
                                <img src="build/img/estados-icon.svg" alt="seccion de estados">
                                <p>States</p>
                            </button>
                            <button id="event-button" class="section-button">
                                <img src="build/img/eventos-icon.svg" alt="seccion de estados">
                                <p>Activities</p>
                            </button> 
                        </div> <!--section-index-->`

export const sectionsView = `<div class="section-view">
                        <button class="agregar-boton">
                            <p>New State</p>
                        </button>
                    </div>`

export const inspectionArea = document.createElement("div");
inspectionArea.classList.add("inspection-area");

export const visualitationArea = `<div class="visualization-area">
                            
                        </div>`

export const visualitationContainer = `<div class="container">
                                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                                </div>`;

let activeSect;
let modalForm;
export let selectedItemList = "";
export let matriz = [];

export function setSelectedItemList (s){
    selectedItemList = s;
}

export function createOverviewNavBar(){
    /* Crea la barra de navegación de  la página de overview */
    const navegationbar = document.querySelector("nav");
    navegationbar.removeAttribute("class");
    navegationbar.classList.add("nav-app");
    navegationbar.innerHTML = `${homeButton}`;
    rightButtons.innerHTML = `${discardButton}\n${downloadButton}`;
    navegationbar.appendChild(rightButtons);
    $(rightButtons, "#download-button").addEventListener("click", askUserTittle);
}
export function createOverviewNavBarVIDEO(){
    /* Crea la barra de navegación de  la página de overview */
    const navegationbar = document.querySelector("nav");
    navegationbar.removeAttribute("class");
    navegationbar.classList.add("nav-app");
    navegationbar.innerHTML = `${homeButton}`;
    rightButtons.innerHTML = `${discardButton}\n${downloadButton}`;
    navegationbar.appendChild(rightButtons);
    $(rightButtons, "#download-button").addEventListener("click", askUserTittle);
}

function askUserTittle (){
    if(usedEventNames.length === 0){
        notifyUser(13);
        return 0;
    }

    renderModalForm(popUserTittle);
    
    $(modalForm, ".cancel-button").addEventListener("click", ()=>{
        backgroundGrey.remove();
    });

    $(modalForm, ".accept-button").addEventListener("click", ()=>{
        generateScript();
    });


}

function renderModalForm(form){
    /* Renderiza el fondo gris de un dialogo modal */
    const backgroundGrey = document.createElement("div");
    backgroundGrey.classList.add("--ask-gb");
    backgroundGrey.innerHTML = form;
    modalForm = backgroundGrey;

    document.querySelector("body").appendChild(backgroundGrey);
}

function generateScript(){
    /* Función que desencadena la creación del script de SEL */
    const modulename = $(modalForm, "input").value;
    const modulevideo = $(modalForm, "#name-video").value;

    if ( !modulename ){
        renderTittleErrorMsg();
        return 0;
    }
    
    modalForm.remove();
    writeScriptFile(modulename,modulevideo);
}

function renderTittleErrorMsg(){
    /* Renderiza mensaje de error de selección de título */
    if ( $(modalForm, "p" )){
        return 0;
    }
    const msgError = document.createElement("p");
    msgError.textContent = "You must choose a valid name.";
    msgError.classList.add(".mensaje-error");
    document.querySelector(".user-form").appendChild(msgError);
    setTimeout(() => {
        msgError.remove();
    }, 5000);
}

async function validateNotUsed (resolve) {
    /* Valida si hay estados sin utilizar */
    let notUsedATM = []
    for (let key in states){
        if (states.hasOwnProperty(key)){
            if(states[key].usedIn.length === 0){
                notUsedATM.push(key);
            }
        }
    }
    if (notUsedATM.length > 0){
        /* Si hay estados sin usar, pregunta al usuario si 
        desea incluirlos en el script */
        const continueOp = await warningUselessStates(notUsedATM);
        
        /* Si el usuairo contesta que no, devuelve 0 */
        if (!continueOp){
            return resolve(0);
        }
        
        /* Si el usuario contesta que si, elimina el arreglo
        de los estados sin uso */
        if (continueOp === 1){
            notUsedATM = [];
        }
    }
    /* devuelve el arreglo de elementos no utilizados */
    return resolve(notUsedATM);
}


function warningUselessStates(states){
    /* Genera un formulario modal en el que le pregunta 
    al usuario si desea agregar u omitir los estados sin uso. */
    return new Promise((resolve) =>{

        renderModalForm(popWarningUseless);

        $(modalForm, "label").textContent = `The states ${states.join(", ")} have been created but never used. \nDo you want to include them in the script?`;
        $(modalForm, ".cancel-button").addEventListener("click", ()=>{
            modalForm.remove();
            return resolve(0);
        });
        $(modalForm, "#include-state").addEventListener("click", () =>{
            modalForm.remove();
            return resolve(1);
        });
        $(modalForm, "#do-not-include").addEventListener("click", ()=>{
            modalForm.remove();
            return resolve(2);
        });
    });
}

async function writeScriptFile(name, videoname){
    /* Escribe el Sel script */
    /* Valida si existen estados sin uso */
    const notUsedATM = await new Promise(validateNotUsed);

    /* En caso de que existan y el usuario haya presionado 
    en "cancelar, se cancela la operación." */
    if(notUsedATM === 0){
        return 0;
    }

    /* Estructura del documento */
    const header = `module ${name};\n`
    const exp = `export "${videoname}";\n`
    let statesSection = ``;
    let eventsSection = `begin;\n`
    const statesNames = Object.keys(states);
    const eventsNames = Object.keys(events);
    
    /* Se escribe la definición de los estados */
    statesNames.forEach(x => {
        let cords = "";
        if (!notUsedATM.includes(x)){
            states[x].area.forEach(x=>{
                cords += `(${x[0]}, ${x[1]}),`
            });
            let points = cords.slice(0, cords.length-1);
            statesSection += `\tstate ${x} = [${points}];\n`;
        }
    });
    
    /* Se escribe la definición de los eventos */
    eventsNames.forEach(x=>{
        let eventStates = events[x].eventComp.join(", ");
        let eventTypes = events[x].type.slice(0, 3);
        eventsSection += `\t${eventTypes}(${eventStates});\t\t%${x};\n`;
    });
    
    /* Se escribe la línea final del documento */
    eventsSection += "end;";

    /* Se estructura el documento */
    const script = header +exp+ statesSection + eventsSection;

    /* Se crea el archivo y una URL asociada a él */
    const a = document.createElement("a");
    const archivo = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = `${name}.scc`;

    /* Se descarga */
    a.click();
    URL.revokeObjectURL(url);
}

export function overviewInteractions(){
    /* setea las funcionalidades de los botones de la 
    página overview */
    const statesButton = document.getElementById("states-button");
    const eventsButton = document.getElementById("event-button");
    activeSect = statesButton;
    statesButton.addEventListener("click", changeActivSect);
    eventsButton.addEventListener("click", changeActivSect);
    document.querySelector(".agregar-boton").addEventListener("click", displayWorkspace);
    document.getElementById("discard-button").addEventListener("click", ()=>{
        discardAll();
    });
    document.querySelector(".home-button").addEventListener("click", ()=>{
        location.reload();
    });

    statesButton.click();
}

function discardAll (){
    /* Borra todos los estados/eventos realizados */
    if (selectedItemList){
        selectedItemList.click();
    }
    matriz.forEach(x=>{
        x.forEach(y => {
            y.style.backgroundColor="";
        });
    });
    summaryStateList.innerHTML = "";
    stateListViewer.innerHTML = "";
    eventListViewer.innerHTML = "";
    deleteStates();
    deleteUsedColors();
    deleteUsedNames();
    deleteUsedEventNames();
    deleteEvents();
}

function changeActivSect(){
    /* Cambia la sección desplegada en la barra lateral
    (Estados o eventos) */
    if (this === activeSect){
        return 0;
    } 
    activeSect.classList.remove("--active-button");
    this.classList.add("--active-button");
    activeSect = this;
    if (selectedItemList){
        selectedItemList.click();
    }
    console.log(this.querySelector("p").textContent);
    if (this.querySelector("p").textContent === "States"){
        showStatesTab();
    }
    else if (this.querySelector("p").textContent === "Activities"){
        showEventsTab();

    }
}

function showStatesTab(){
    /* muestra la sección estados en la barra lateral */
    document.querySelector(".agregar-boton").querySelector("p").textContent = "New State";
    eventListViewer.remove()
    document.querySelector(".section-view").appendChild(stateListViewer);
}

function showEventsTab(){
    /* muestra la sección eventos en la barra lateral */
    document.querySelector(".agregar-boton").querySelector("p").textContent = "New Activity";
    stateListViewer.remove()
    document.querySelector(".section-view").appendChild(eventListViewer);
}


export function showOverview(){
    //Creacion de navbar
    createOverviewNavBar();
    //quitamos el footer de donde sea que se encuentre
    footer.remove();

    //creando el main
    mainSpace.removeAttribute("class");
    mainSpace.classList.add("overview-space");
    mainSpace.innerHTML="";

    //Agregando el area aside
    sectionsArea.innerHTML=`${sectionsIndex}\n${sectionsView}`;
    $(sectionsArea, ".section-view").appendChild(stateListViewer);
    mainSpace.appendChild(sectionsArea);
    
    //Agregando el area de inspección
    inspectionArea.innerHTML=`${visualitationArea}`;
    inspectionArea.appendChild(footer);
    const containerprueba = document.createElement("div");
    containerprueba.classList.add("visualizer-container");
    containerprueba.appendChild(userImgElement);
    containerprueba.innerHTML = containerprueba.innerHTML + visualitationContainer;
    $(inspectionArea, ".visualization-area").appendChild(containerprueba);
    mainSpace.appendChild(inspectionArea);

    //agregar funciones a los botones
    overviewInteractions();
    initSelectionGrid();
}

export function buildOverviewPage(){
    /* renderiza la página de overview una vez que el usuario
    tiene que volver a ella desde un workspace*/
    createOverviewNavBar();
    statesArea.remove();
    sectionsArea.innerHTML=`${sectionsIndex}\n${sectionsView}`;
    $(sectionsArea, ".section-view").appendChild(stateListViewer);
    mainSpace.appendChild(sectionsArea);
    //Definir interacciones de botones de overview
    overviewInteractions();
}

function displayWorkspace(){
    // Despliega el área de trabajo, dependiendo la sección
    // seleccionada
    const workspace = this.querySelector("p").textContent;
    if (workspace === "New State"){
        /* Despliega el área de trabajo de estados */
        displayStatesWorkspace();
    }
    else if (workspace === "New Activity"){
        if (!stateListViewer.innerHTML){
            /* notifica al usuario que necesita crear un 
            estado al menos para acceder */
            notifyUser(11);
            return 0;
        }
        /* Despliega el área de trabajo de estados */
        displayEventsWorkSpace();
    }
}

function initSelectionGrid() {
    /* Crea la matriz de selección de áreas */
    const cells = document.querySelector(".container").querySelectorAll("div");
    let row = [];
    let countcols = 0;
    let countrows = 0;

    cells.forEach(cell => {
        cell.id = `${countrows},${countcols}`;
        cell.classList.add("position-relative");
        row.push(cell);
        countcols++;

        if (countcols > 8) {
            matriz.push(row);
            row = [];
            countcols = 0;
            countrows++;
        }
    });
}


