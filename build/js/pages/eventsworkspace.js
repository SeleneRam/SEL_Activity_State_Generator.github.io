
import { selectedItemList, eventListViewer, inspectionArea, 
    matriz, setSelectedItemList, 
    buildOverviewPage} from "../components/overview.js";

import { mainButtons } from "../components/buttons.js";

import { statesArea, summaryStateList, elementToEdit, 
        setElementToEdit, IsItemInTheArray, getIntId, 
        buildWorkspace, $, removeElement} from "../components/workspace.js";

import { highlightState, unHighlightState, states,
        usedNames,
        emptyListViewerMessage} from "./statesworkspace.js";

import { notifyUser } from "../components/notifications.js";

import { warningProgressLoss } from "../components/popMessages.js";

/* Variable que contiene los eventos creados */
export let events={};

/* Variable que contiene los nombres de evento usados */
export let usedEventNames = [];

/* Almacena la primitiva del evento que está siendo creado*/
let modeEvent = 0;

/* Almacena los estados que el usuario seleccione 
para crear un evento */
let eventComponents=[];

/* Conteo de componentes (estados) de un evento que está 
siendo creado. */
let componentCount = 0;

/* Almacenará el list controller */
let listController = "";

/* Variables globales */
let headerPage = "";
let eventNameInput = "";
let parallelButton = "";
let concurrencyButton = "";
let sequencyButton = "";
let botonAgregar = "";
let volverButton = "";
let guardarboton = "";
let formulario = "";
let listView = "";

/* Almacena el nombre de evento asignado por el usuario */
let eventName = "";

export function deleteEvents(){
    events = {};
}

export function deleteUsedEventNames(){
    usedEventNames = [];
}

export function displayEventsWorkSpace(){
    if (selectedItemList){
        selectedItemList.click();
    }
    
    /* renderizar espacio de trabajo para eventos */
    buildWorkspace(0);
    
    /* Asignacion de variables globales para funcion 
    de agregar estados*/
    setEventsGlobalComponents();
    
    /* Asignación de eventos a componentes de la UI */
    eventsWorkspaceInteractions();
    
    eventNameInput.focus();
}

function setEventsGlobalComponents(){
    concurrencyButton   = document.getElementById("concurrency-button");
    parallelButton      = document.getElementById("parallel-button");
    sequencyButton      = document.getElementById("sequency-button");
    volverButton        = document.getElementById("regresar-boton");
    guardarboton        = document.getElementById("guardar-boton");
    listView            = document.getElementById("list-view");
    eventNameInput      = document.getElementById("name");
    botonAgregar        = document.querySelector(".agregar-boton");
    formulario          = document.querySelector(".formulario");
    headerPage          = document.querySelector("h2");
}

function eventsWorkspaceInteractions(){
    /* Asigna los eventos necesarios a la UI */
    guardarboton.addEventListener("click", returnOverViewSaveEvent);
    volverButton.addEventListener("click", returnOverViewEvent);
    parallelButton.addEventListener("click", setEventMode);
    concurrencyButton.addEventListener("click", setEventMode);
    sequencyButton.addEventListener("click", setEventMode);
    listView.addEventListener("click", activateListViewEvents);
    eventNameInput.addEventListener("input", updateEventName);
    botonAgregar.addEventListener("click", addNewEvent);
    eventNameInput.addEventListener('keydown', (e)=> {
        if (e.key === 'Enter') {
            botonAgregar.click();
            e.preventDefault(); // Prevenir envío del formulario
        }
    });
}

function returnOverViewSaveEvent(){
    /* Ejecuta la función de agregar nuevo evento y 
    regresa la página de overview */
    let result = 1;
    
    if(listView.classList.length !== 0){
        listView.click();
    }
    
    result = addNewEvent();
    
    if (!result){
        return 0;
    }
    returnOverViewEvent(null, 1);
}

async function returnOverViewEvent(e, save=0){
    /* Regresar a la página de overview */
    if (save === 0){
        const msgSucc = $(inspectionArea, ".user__success");
        if (msgSucc){
            msgSucc.remove();
        }
    }
    if (document.querySelector(".--list-view")){
        document.querySelector("#list-view").click();
    }
    if (elementToEdit){
        document.querySelector("#boton-cancelar").click();
    }
    if (eventComponents.length > 0){
        const result = await warningProgressLoss();
        if(!result){
            return 0;
        }
    }
    summaryStateList.querySelectorAll(".--selected-state").forEach(x=>{x.click();});
    inspectionArea.querySelectorAll(".user__error").forEach(x=>{x.remove();});
    buildOverviewPage();
    document.getElementById("event-button").click();
    eventName = "";
}

function cancelEditEvent(){
    /*  Cancela la edición de evento */
    usedEventNames.push(elementToEdit.nameEvent);
    exitEditEvent();
}

function exitEditEvent(){
    /* desactiva el modo de edición de eventos */
    const unselectAllButton = $(statesArea, "#unselect-all-button");
    if (unselectAllButton){
        unselectAllButton.click();
    }
    eventListViewer.querySelectorAll(".cover-up-grid").forEach(x=>{
        x.parentElement.addEventListener("click", selectedEvent);
        x.remove();
    });
    const editingEvent = $(eventListViewer, ".--selected-state");
    editingEvent.addEventListener("click", selectedEvent);
    $(editingEvent, ".editing-state-label").remove();
    $(editingEvent, ".--invisible-element").classList
                        .remove("--invisible-element");
    
    editingEvent.click();
    setElementToEdit("");
    statesArea.remove();
    displayEventsWorkSpace();
}

function setEventMode(e){
    /* Selección de primitiva de eventos */
    restartEventsTypesSection();
    switch (this.id){
        case "parallel-button":
            modeEvent = 1;
            break;
        case "concurrency-button":
            modeEvent = 2;
            break;
        case "sequency-button":
            modeEvent = 3;
            break;
    }
    this.classList.add("--active-button2");
    const coverUp = document.querySelector(".cover-up");
    if (coverUp){
        coverUp.remove();
    }
    e.preventDefault();
}

function restartEventsTypesSection(){
    /* reinicia la selección de primitivas de eventos */
    switch (modeEvent){
        case 1:
            document.getElementById("parallel-button")
                .classList.remove("--active-button2");
            break;
        case 2:
            document.getElementById("concurrency-button")
                .classList.remove("--active-button2");
            break;
        case 3:
            document.getElementById("sequency-button")
                .classList.remove("--active-button2");
            break;
    }
    modeEvent = 0;
}

function updateEventName(e){
    /* Actualiza la global de nombre de evento */
    eventName = e.target.value;
}

function addNewEvent(){ 
    /* Guarda un nuevo evento */
    if (!eventName){
        notifyUser(3);
        eventNameInput.focus()
        return 0;
    }
    if (modeEvent === 0){
        notifyUser(4);
        return 0;
    }
    if (eventComponents.length === 0){
        notifyUser(1);
        return 0;
    }
    if (usedEventNames.includes(eventName) || usedNames.includes(eventName)){
        notifyUser(2);
        eventNameInput.focus();
        return 0;
    }
    const getEventType = ()=>{
        if (modeEvent === 1){
            return "parallel";
        }
        else if (modeEvent === 2){
            return "concurrency";
        }
        else if (modeEvent === 3){
            return "sequency";
        }
    };
    
    let newEvent = {
        nameEvent : eventName,
        eventComp : [...eventComponents],
        type : getEventType()
    }
    
    eventComponents.forEach(x=>{
        states[x].usedIn.push(eventName);
    });
    
    events[eventName] = newEvent;
    usedEventNames.push(eventName);
    
    if (elementToEdit){
        /* si estaba activo el modo edición */
        updateEditedEvent(newEvent);
        notifyUser(12, elementToEdit.nameEvent);
        exitEditEvent();
        return 1;
    }
    
    eventListViewer.appendChild(generateEventCard(newEvent));
    
    document.querySelectorAll(".user__error")
            .forEach(x=>{x.remove()});
    
    const msg = document.querySelector(".user__success");
    
    if(msg){
        msg.remove();
    }
    
    notifyUser(5, eventName);
    
    setDefaultValues();
    
    $(statesArea, "#unselect-all-button").click();
    coverUpList();
    
    eventNameInput.focus();
    return 1;
}

function updateEditedEvent(newEvent){
    /* Actualiza los datos de un evento editado. */
    const elementName = elementToEdit.nameEvent;
    elementToEdit.eventComp.forEach(x=>{
        states[x].usedIn = removeElement(states[x].usedIn, elementName);
    });
    if (elementToEdit.nameEvent != eventName){
        delete events[newEvent];
        $(selectedItemList, ".estado__titulo").textContent = eventName;
        selectedItemList.id = `event-card-${eventName}`
    }
    if (JSON.stringify(elementToEdit.eventComp) != JSON.stringify(newEvent.eventComp)){
        $(selectedItemList, ".estado__color-text").textContent = newEvent.eventComp.join(", ");
    }
}

function setDefaultValues(eventName=null, eventType=null){
    /* Vuelve a los valores por defecto */
    const elementEvent = new Event("input");
    headerPage.textContent = eventName ?? "New Activity";
    eventNameInput.value = eventName ?? "";
    eventNameInput.dispatchEvent(elementEvent);
    if (eventType === null){
        restartEventsTypesSection();
    }
    else {
        document.getElementById(`${eventType}-button`).click();
    }
}

function coverUpList(){
    /* cubre los elementos de la summarylist, dejandolos
    desactivados */
    const coverUp = document.createElement("div");
    coverUp.classList.add("cover-up");
    document.querySelector(".list-elements").appendChild(coverUp);
}

function generateEventCard(data) {
    /* Devuelve la event card para un evento recién creado */
    const newEventCard = `
        <div class="estado__data">
            <div class="estado__encabezado">
            <img src="build/img/${data.type}.svg"></img>
            <h4 class="estado__titulo">${data.nameEvent}</h4>
            </div>
            <h3 class="estado__color-text">${[...data.eventComp].join(", ")}</h3>
        </div>
        <div class="estado__buttons">
            <img class="estado__editar" src="build/img/settings.svg" alt="boton editar">
            <img class="estado__eliminar" src="build/img/trash.svg" alt="boton eliminar">
        </div>`
    const temp = document.createElement('div');
    temp.classList.add("estado");
    temp.id = `event-card-${data.nameEvent}`;
    temp.innerHTML = newEventCard;
    temp.addEventListener("click", selectedEvent);
    temp.querySelector(".estado__eliminar").addEventListener("click", deleteEvent);
    temp.querySelector(".estado__editar").addEventListener("click", editEvent);
    return temp;
}

function deleteEvent(){
    /* Eliminar evento */
    const eventToDelete = this.parentElement.parentElement;
    const eventKey = $(eventToDelete, "h4").textContent;
    usedEventNames = removeElement(usedEventNames, eventKey);
    eventToDelete.remove();
    
    events[eventKey].eventComp.forEach(x=>{
        states[x].usedIn = removeElement(states[x].usedIn, eventKey);
    });
    
    delete events[eventKey];
}

function editEvent(){
    /* Activa el modo edición  */
    const cardButtons = this.parentElement;
    const eventToEditCard = this.parentElement.parentElement;
    
    cardButtons.classList.add("--invisible-element");
    
    const eventKey = $(eventToEditCard, "h4").textContent;
    const eventToEdit = events[eventKey];
    setElementToEdit(eventToEdit);
    
    const label = createEditingLabel();
    
    eventToEditCard.appendChild(label);

    console.log(listController);

    $(listController, "#unselect-all-button").click();

    statesArea.remove();
    
    displayEventsWorkSpace();
    
    const cancelbutton = createCancelButton(); 
    mainButtons.appendChild(cancelbutton);
    
    $(botonAgregar, "p").textContent = "Update";
    
    setDefaultValues(eventKey, elementToEdit.type);
    
    eventToEdit.eventComp.forEach(x=>{
        $(summaryStateList, `#summary-card-${x}`).click();
    });
    
    usedEventNames = removeElement(usedEventNames, eventKey)
}

function createEditingLabel(){
    /* Crea la etiqueta de "editando" */
    const label = document.createElement("div");
    label.classList.add("editing-state-label");
    label.textContent = "Editing";
    return label;
}

function createCancelButton(){
    /* crea el botón de cancelar */
    const cancelbutton = document.createElement("button");
    cancelbutton.classList.add("agregar-boton");
    cancelbutton.id = "boton-cancelar";
    cancelbutton.innerHTML =`<p>Cancel</p>`;
    cancelbutton.addEventListener("click", cancelEditEvent);
    return cancelbutton;
}


function selectedEvent(){
    /* Marca cómo seleccionado un event card sobre el que 
    se haya dado clic */
    if (selectedItemList && selectedItemList != this){
        selectedItemList.classList.remove("--selected-state");
        unHighlightState();
    }
    if(this.classList.toggle("--selected-state")){
        
        setSelectedItemList(this);
        
        if (elementToEdit){
            disableRemainingEvents();
            return 0;
        }
        if (componentCount > 0){
            $(listController, "#unselect-all-button").click();
            componentCount = 0;
        }
        
        const eventKey = $(this, ".estado__titulo").textContent;
        
        if (!events[eventKey]){
            return 0;
        }
        
        let eventArea = [];
        events[eventKey].eventComp.forEach(x=>{
            eventArea = [...eventArea, ...states[x].area];
        });
        
        highlightState(eventArea);
    }
    else {
        setSelectedItemList("");
        unHighlightState();
    }
}

function disableRemainingEvents() {
    /* Deshabilita el resto de los eventos cuando alguno es 
    elegido para ser editado */
    eventListViewer.childNodes.forEach(x=>{
        x.removeEventListener("click", selectedEvent);
        if (![...x.classList].includes("--selected-state")){
            const coverUp = document.createElement("div");
            coverUp.classList.add("cover-up-grid");
            x.appendChild(coverUp);
        }
    });
}

function activateListViewEvents(){
    /* Activa o desactiva la lista de visualización en 
    el área de creación de eventos */
    if(this.classList.toggle("--list-view")){
        /* Si no hay eventos, se imprime el mensaje de que no 
        se ha creado ninguno. */
        renderListView();
    } 
    else {
        /* Si hay eventos, se despliega la lista 
        de visualización */
        renderEventForm();
    }
}

function renderListView(){
    /* Renderizado de la lista de visualización */
    headerPage.textContent = "Activity List";
    mainButtons.remove();
    formulario.remove();
    if (Object.keys(events).length === 0) {
        /* Si no hay estados, se imprime el mensaje de que no 
        se ha creado ninguno. */
        const emptyListMsg = emptyListViewerMessage(0);
        statesArea.appendChild(emptyListMsg);
    }
    else {
        /* Si hay estados, se despliega la lista 
        de visualización */
        statesArea.appendChild(eventListViewer);
    }
}

function renderEventForm(){
    /* Renderiza el formulario de creación de eventos */
    headerPage.textContent = elementToEdit ? elementToEdit.nameEvent : "New Activity";

    /* Si hay un elemento seleccionado en 
    la lista de visualización, lo deselecciona */
    if (selectedItemList){
        selectedItemList.click();
    }
    eventListViewer.remove();
    statesArea.appendChild(formulario);
    statesArea.appendChild(mainButtons);

    const noStatesMessage = $(statesArea, "#noStatesMessage");
    if (noStatesMessage) {
        /* Si no había estados creados, elimina el mensaje
        de "no has creado ningún estado aún." */
        noStatesMessage.remove();
    } else {
        /* Si había estados, quita la lista de visualización */
        eventListViewer.remove();
    }
}

function createListController (){
    /* Crea y renderiza la lista de control para la 
    summaryListview en el workspace de eventos */
    listController = document.createElement("div");
    listController.classList.add("list-controler");
    listController.innerHTML = `<div class="controller-button" id="view-button">
                                    <img src="build/img/view.svg" alt="">
                                </div>
                                <div class="controller-button" id="unselect-all-button">
                                    <img src="build/img/trash.svg" alt="">
                                </div>`;
    const viewButton = $(listController, "#view-button");
    const discardButton =  $(listController, "#unselect-all-button");
    viewButton.addEventListener("click", showSelectedComponents);
    discardButton.addEventListener("click", unselectAll);
    document.querySelector(".list-elements").appendChild(listController);
}

function removeElementSelected(element){
    /* Eliminar un elemento de la lista de componentes para 
    un evento que está siendo creado */
    const tittle = $(element, ".estado__titulo").textContent;
    componentCount --;
    
    if (componentCount === 0 && document.querySelector(".search-results")){
        document.getElementById("view-button").click();
    }
    if (componentCount === 0){
        listController.remove();
        unhighlightAll();
    } else {
        removeHighlightedArea(tittle);
    }

    element.classList.remove("--selected-state");
    eventComponents = removeElement(eventComponents, tittle);
    const labelcount = $(element, ".count-label");
    const itemNum = parseInt(labelcount.textContent);
    labelcount.remove();
    updateElementsNumeration(itemNum);
}

function updateElementsNumeration(start){
    /* Actualiza la numeración de los componenetes luego de 
    haber eliminado alguno. */
    document.querySelectorAll(".count-label").forEach(x=>{
        const num = parseInt(x.textContent);
        if (num>start){
            x.textContent = num-1;
        }
    });
}

function showSelectedComponents(){
    /* Muestra los componentes seleccionados ordenados */
    const parent = listController.parentElement.parentElement;
    const list = $(parent, ".components-list")
    
    
    if(this.classList.toggle("--active-button2")){
        /* Mostrar la lista de elementos seleccionados 
        ordenados */
        renderFilteredList(list);
        summaryStateList.remove();
    } else {
        /* Muestra la summary state list con los elementos 
        en el orden original */
        renderOriginalList(list);
    }
}

function renderFilteredList(parent){
    /* Crea la lista de elementos seleccionados únicamente 
    y la ordena */
    const results = document.createElement("div");
    results.classList.add("search-results");
    const contentView = [...document.querySelectorAll(".--selected-state")];
    contentView.sort( sortByLabelNumber );
    contentView.forEach(x=>{
        results.appendChild(x);
    });
    parent.appendChild(results);
}

const sortByLabelNumber = (a, b) => {
    /* retorna la resta de los números de etiquetas 
    de dos summaryCards */
    return getLabelNumber(a) - getLabelNumber(b);
}

function getLabelNumber(element){
    /* Dada una summarycard, retornar el 
    número de la etiqueta de conteo */
    return parseInt($( element, ".count-label" ).textContent);
}

function renderOriginalList(parent){
    /* Renderiza la summarystatelist con los elementos 
    renderizados en el orden original en el dom*/
    const searchRes = $(parent, ".search-results");
    let originalOrder = [];
    parent.innerHTML = "";
    
    searchRes.childNodes.forEach(x=>{
        const stateTittle = $(x, ".estado__titulo").textContent;
        const originalIndex = usedNames.indexOf(stateTittle);
        originalOrder.push([originalIndex, x]);
    });

    originalOrder.sort((a, b) => a[0] - b[0]);

    renderOriginalOrderCards(originalOrder);
    
    parent.appendChild(summaryStateList);
}

function renderOriginalOrderCards(orderArray){
    /* Renderiza las summary cards en el orden original 
    dentro del summarystatelist*/
    const summaryCards = summaryStateList.children;
    orderArray.forEach(x => {
        if (x[0] >= summaryCards.length){
            summaryStateList.appendChild(x[1]);
        }
        else {
            summaryStateList.insertBefore(x[1], summaryCards.item(x[0]));
        }
    });
}

function unselectAll(){
    /* Función para descartar toda la selección 
    de estados en la creación de un evento */
    let listComponents = this.parentElement.parentElement;
    
    if ($(listComponents, ".search-results")){
        $(listController, "#view-button").click();
    }
    summaryStateList.querySelectorAll(".--selected-state").forEach(x=>{
        x.click();
    });
}

function highlightSummary(stateName){
    /* Oscurece el area que no pertenece al área del estado
    indicado por el usuario */
    const area = states[stateName].area;
    document.querySelector(".container").querySelectorAll("div").forEach(x=>{
        if (IsItemInTheArray(area, getIntId(x)) === -1){
            renderCoverUpGrid(x);
        }
    });
}

function unhighlightAll(){
    /* Quita todo el oscurecimiento del área de inspección */
    document.querySelectorAll(".cover-up-grid").forEach(x=>{
        x.remove();
    });
}

function addHighlightedArea(stateName){
    /* Agrega area iluminada al área oscurecida en caso de que 
    el usuario indique más estados */
    const area = states[stateName].area;
    area.forEach(x=>{
        $(matriz[x[0]][x[1]], ".cover-up-grid").remove();
    });
}

function removeHighlightedArea(stateName){
    /* Oscurece área que previamente estaba resaltada en caso de
    que el usuario quite un estado de su selección */
    const area = states[stateName].area;
    area.forEach(x=>{
        renderCoverUpGrid(matriz[x[0]][x[1]]);
    });
}

function renderCoverUpGrid(parent){
    /* Dado el elemento padre, creamos y renderizamos 
    el elemento que lo cubrirá. */
    const darkDiv = document.createElement("div");
    darkDiv.classList.add("cover-up-grid");
    parent.appendChild(darkDiv);
}

export function addElementSelected(){
    /* Agrega elemento a la lista de componentes */
    const elementClasses = [...this.classList];
    if (elementClasses.includes("--selected-state")){
        removeElementSelected(this);
        return 0;
    }
    if (componentCount === 0){
        createListController();
        highlightSummary( $(this, ".estado__titulo").textContent );
    } else {
        addHighlightedArea( $(this, ".estado__titulo").textContent );
    }
    componentCount++;
    renderLabelCount(this);
    this.classList.add("--selected-state");
    eventComponents.push( $(this, ".estado__titulo").textContent );
}

function renderLabelCount(parent){
    /* Renderiza la etiqueta de conteo sobre un elemento seleccionado */
    const labelCount = document.createElement("div");
    labelCount.classList.add("count-label");
    labelCount.textContent = componentCount;
    parent.appendChild(labelCount);
}