import { selectedItemList, 
    setSelectedItemList, matriz, buildOverviewPage } from "../components/overview.js";

import { mainButtons } from "../components/buttons.js";

import { inspectionArea, stateListViewer, 
    eventListViewer} from "../components/overview.js";

import { statesArea, IsItemInTheArray, 
    removeValueFromArray, elementToEdit, summaryStateList, 
    setElementToEdit, getIntId, buildWorkspace, $, 
    removeElement} from "../components/workspace.js";

import { notifyUser } from "../components/notifications.js";

import { addElementSelected, events, 
        usedEventNames} from "./eventsworkspace.js";

import { warningProgressLoss } from "../components/popMessages.js";

/* Variable que contiene los estados creados*/
export let states = {};

/* Variable que contiene los nombres de estado en uso*/
export let usedNames = [];
let originalIndex = 0;

//Asignacion de variables globales para funcion de agregar estados
let headerPage = "";
let botonAgregar = "";
let listView = "";
let guardarboton = "";
let volverButton = "";
let formulario = "";
let colorPicker = "";
let opacityPicker = "";
let stateNameInput = "";
let valueColor = "";
let valueOpacity = "";
let multiSelectButton = "";
let indSelectButton = "";
let deleteButton = "";
let trashButton = "";
let toolsSect = "";

/* configuarción de color por defecto para 
seleccionar área*/
const selectionColor = "rgba(255, 255, 255, 0.35)";
let opacity = "0.5";

/* Almacena el color que el usuario seleccionó. */
let color = "";

/* Variable de error */
let error = 0;

/* Variables para selección de área */
/* Herramienta seleccionada */
let mode = 0;

/* Datos para realizar selección múltiple correctamente. */
let inicio = 0;
let actual = 0;
let anterior = 0;

/* Dirección de selección múltiple  */
let right = false;
let left = false;
let up = false;
let down = false;

/* Almacena el nombre de estado asignado por el usuario */
let nameState = "";

/* Alamacena los colores usados por el usuario */
let usedColors = [];

/* Almacena el área seleccionada confirmada 
por el usuario */
let selectedArea = [];

/* Almacena el área seleccionada antes de confirmar durante
la ejecución de una selección múltiple */
let selectedItems = [];

export function deleteStates(){
    states = {};
}

export function deleteUsedColors(){
    usedColors = [];
}

export function deleteUsedNames(){
    usedNames = [];
}

export function displayStatesWorkspace(){
    if (selectedItemList){
        selectedItemList.click();
    }
    /* Renderiza el espacio de trabajo para estados */
    buildWorkspace(1);

    /* Activar celdas para creación de estados */
    selectionGridForWork();

    /*Asignacion de variables globales para funcion 
    de agregar estados*/
    setStatesGlobalComponents();

    /* Asignar eventos a componentes de la UI */
    statesWorkspaceInteractions();

    /* Asignar valores por defecto */
    setDefaultValues();

    stateNameInput.focus();
}

function setStatesGlobalComponents(){
    /*Asignacion de variables globales para funcion 
    de agregar estados*/
    botonAgregar      = document.getElementById("boton-agregar");
    listView          = document.getElementById("list-view");
    guardarboton      = document.getElementById("guardar-boton");
    volverButton      = document.getElementById("regresar-boton");
    colorPicker       = document.getElementById("color-picker");
    opacityPicker     = document.getElementById("opacity-picker")
    stateNameInput    = document.getElementById("name");
    valueColor        = document.getElementById("selected-color");
    valueOpacity      = document.getElementById("selected-opacity");
    multiSelectButton = document.getElementById("multi-select");
    indSelectButton   = document.getElementById("ind-select");
    deleteButton      = document.getElementById("delete-button");
    trashButton       = document.getElementById("trash-button");
    toolsSect         = document.querySelector(".tools-section");
    formulario        = document.querySelector(".formulario");
    headerPage        = document.querySelector("h2");
}

function statesWorkspaceInteractions(){
    /* Asigna las funciones correspondientes a 
    los elementos en la UI */
    formulario.addEventListener("input", updateGlobalInfo);
    botonAgregar.addEventListener("click", addNewState);
    listView.addEventListener("click", activateListView);
    toolsSect.addEventListener("click", changeActiveButton);
    guardarboton.addEventListener("click", returnToOverViewSave);
    volverButton.addEventListener("click", returnToOverView);
    stateNameInput.addEventListener("keyup", (e)=>{
        if (e.key === "Enter"){
            botonAgregar.click()
        }
    }); 
}

function updateGlobalInfo(e){
    /* Evalúa qué dato es el que se ha ingresado */
    switch(e.target.id){

        /*  Basado en el campo que se haya modificado, 
            actualiza la variable global correspondiente. */
        case "name":
            updateStateName(e);
            break;
        case "color-picker":
            updateGlobalColor(e);
            break;
        case "opacity-picker":
            updateGlobalOpacity(e);
            break;
    }
}

function getRandomHexColor() {
    /* retorna un color hexadecimal aleatorio */
    let hexNums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let randomColor = ["#"];
    for (let i = 0; i < 6; i++) {
        let index = Math.floor(Math.random() * hexNums.length);
        randomColor.push(hexNums[index]);
    }
    return randomColor.join("");
}


function hexToRgba (hex) {
    /* dado un color en hexadecimal, retorna 
    su versión en rgba */
    return `rgba(${hex >> 16 & 255}, ${hex >> 8 & 255}, ${hex & 255}, ${opacity})`;
}

function validateColorSelection(){
    /* Valida que el color elegido por el usuario no haya sido 
    usado anteriormente.  */
    if (usedColors.includes(color)){
        /* si el color ha sido usado anteriormente */
        error = 1;
        notifyUser(10);
        return 0;
    }
    /* si el color no ha sido usado anteriormente */
    error = 0;
    const msg = $(inspectionArea, "#usedColorError");
    if(msg){
        msg.remove();
    }
    return 1;
}

function setDefaultValues(statename=null, opacity=null, color=null) {
    /* Setea los valores por defecto para la creación
    de estados */
    const inputEvent = new Event("input", {
        bubbles:true,
        cancelable:true
    });
    headerPage.textContent = statename ?? "New State";
    stateNameInput.value   = statename ?? "";
    opacityPicker.value    = opacity   ?? "0.5";
    colorPicker.value      = color     ?? getRandomHexColor();
    stateNameInput.dispatchEvent(inputEvent);
    opacityPicker.dispatchEvent(inputEvent);
    colorPicker.dispatchEvent(inputEvent);
}

function selectionGridForWork(){
    /* Activa las celdas para la definición 
    de áreas de estados */
    const cells = document.querySelector(".container")
                            .querySelectorAll("div");

    cells.forEach(x => {
        x.classList.add("grid-item");
        cellModeOn(x);
    });
}

function selectionGridForOverview(){
    /* Desactiva las celdas para la definición 
    de áreas de estados */
    const cells = document.querySelector(".container")
                            .querySelectorAll("div");

    cells.forEach(x => {
        x.classList.remove("grid-item");
        cellsModeOff(x);
    });
}

function updateGlobalColor(e) {
    /* Actualiza la variable global de color una vez que 
    el usuario escoge uno nuevo mientras crea un nevo estado. */

    let colorhex = "0x" + e.target.value.slice(1);
    let colorRgba = hexToRgba (colorhex);

    if (colorRgba === selectionColor) {
        e.target.value = "#FCFCFC";
        colorRgba = hexToRgba ("0xFCFCFC");
        return 0;
    }

    color = colorRgba;
    selectedArea.forEach(x => {
        matriz[x[0]][x[1]].style.backgroundColor = color;
    });

    valueColor.value = e.target.value.toUpperCase();
    if (!validateColorSelection()){
        restartToolButtons();
    }
}

function updateGlobalOpacity(e) {
    /* Actualiza la variable global de opacidad una vez que 
    el usuario escoge una nueva mientras crea un nevo estado. */
    const inputEvent = new Event("input", {
        bubbles:true,
        cancelable:true
    });
    opacity = e.target.value;
    valueOpacity.textContent = Math.round(opacity * 100) / 100 ;
    colorPicker.dispatchEvent(inputEvent);
}

function updateStateName(e) {
    /* Actualiza la variable global de nombre de estado
    una vez que el usuario lo cambia. */
    nameState = e.target.value;
}

function checkValidName(s){
    /* Valida que el nombre elegido no sea mayor a 10, 
    sea alfanumérica e inicie con letra mayúscula o minúscula.*/
    let pattern = /^[A-Za-z]{1}[A-Za-z0-9_]*$/;
    return pattern.test(s);
}

function addNewState() {
    /* Guarda un nuevo estado */

    /* Validar si todos los datos son correctos */
    if (nameState === "" || !checkValidName(nameState)){
        notifyUser(7);
        stateNameInput.focus();
        return 0;
    }

    if (usedNames.includes(nameState) || usedEventNames.includes(nameState)){
        notifyUser(8);
        stateNameInput.focus();
        return 0;
    }

    if (selectedArea.length === 0) {
        notifyUser(6);
        return 0;
    }

    if (error){
        notifyUser(10);
        return 0;
    }

    /* Creación de un nuevo estado */
    let newState = {
        name: nameState,
        color: colorPicker.value.toUpperCase(),
        colorRgba: color,
        opacity: opacity,
        area: selectedArea, 
        usedIn: elementToEdit ? elementToEdit.usedIn : []
    }
    /* Guardar el nuevo estado */
    states[nameState] = newState;

    /* Limpiar el área seleccionada dado que ya almacenamos 
    los datos en el nuevo objeto estado */
    selectedArea = [];

    /* Agregar un nuevo color a la lista de 
    colores usados */
    usedColors.push(color);

    if (!elementToEdit){
        /* Si no estamos en modo de edición, creamos state 
        card y summary state card para el nuevo estado. */
        createNewStateCards(newState);
        /* Agregar un nuevo nombre a la lista de 
        nombres usados */
        usedNames.push(nameState);
    } else{
        /* Si estamos en modo de edición, actualizamos la 
        state card y la summary state card. */
        updateStateCards();
        /* Modificar el nombre que anteriormente tenía el  
        estado modificado*/
        usedNames[originalIndex] = nameState;
    }

    /* Asignamos valores por defecto a todos 
    los input del formulario */
    setDefaultValues();

    /* En caso de haber algún estado resaltado, 
    dejamos de resaltarlo */
    unHighlightState();

    stateNameInput.focus();

    return 1;
}

function createNewStateCards(newState){
    /* Renderiza una nueva state card y una nueva summary card
    para un estado recién creado. */
    const stateCard = generateStateCard(newState);
    const data = [  $(stateCard, ".estado__color"), 
                    $(stateCard, ".estado__titulo")];

    const summaryCard = generateSummaryStateCard(data);
    summaryStateList.appendChild(summaryCard);
    stateListViewer.appendChild(stateCard);
    notifyUser(9, nameState);
}

function updateStateCards(){
    /* Actualiza la state card y la summary 
    card de un estado editado*/
    updateSummaryStateCard();
    updateStateCard();
    notifyUser(12, elementToEdit.name);
    editStateExit();
}

function updateSummaryStateCard(){
    /* Actualiza la summary state card de un estado editado. */
    const summaryCardId = `#summary-card-${elementToEdit.name}`;
    const summaryCard = $(summaryStateList, summaryCardId);
    const summaryCardColor = $(summaryCard, ".estado__color");
    summaryCardColor.style.backgroundColor = valueColor.value;

    if (elementToEdit.name !== nameState){
        /* En caso de que el usuario haya cambiado el nombre */
        updateStateNameInCards(summaryCard);
        updateStateNameInEventsData();
    }
}

function updateStateNameInCards(summaryCard){
    /* Actualiza el nombre en la state y summary state card */
    const summaryCardTittle = $(summaryCard, ".estado__titulo");
    summaryCardTittle.textContent = nameState;
    delete states[elementToEdit.name];
    selectedItemList.id = `state-card-${nameState}`;
    summaryCard.id = `summary-card-${nameState}`;
}

function updateStateNameInEventsData(){
    /* Actualiza el nombre en la lista de componentes de 
    todos los eventos en los que aparece. */
    elementToEdit.usedIn.forEach(x=>{
        const eventCompList = events[x].eventComp;
        const i = eventCompList.indexOf(elementToEdit.name);
        eventCompList[i] = nameState; 
        const eventCard = $(eventListViewer, `#event-card-${x}`);
        const newCompList = $(eventCard, ".estado__color-text");
        newCompList.textContent = eventCompList.join(", ");
    });
}

function updateStateCard(){
    /* Actualiza la state card de un estado editado. */
    const tempSpan = $(selectedItemList, "span");
    const tittle = $(selectedItemList, ".estado__titulo");
    const stateColor = $(selectedItemList, ".estado__color-text");
    const stateColor2 = $(selectedItemList, ".estado__color")
    tempSpan.textContent = `${opacity * 100}%`;
    tittle.textContent = nameState;
    stateColor.textContent = valueColor.value;
    stateColor.appendChild(tempSpan);
    stateColor2.style.backgroundColor = valueColor.value;
}

function generateStateCard(data) {
    /* Crea una nueva state card para un estado recién creado
    a partir de este. */
    const newStateCard = `
        <div class="estado__color" style="background-color: ${data.color}"></div>
        <div class="estado__data">
            <h4 class="estado__titulo">${data.name}</h4>
            <h3 class="estado__color-text">${data.color} <span>${data.opacity * 100}%</span></h3>
        </div>
        <div class="estado__buttons">
            <img class="estado__editar" src="build/img/settings.svg" alt="boton editar">
            <img class="estado__eliminar" src="build/img/trash.svg" alt="boton eliminar">
        </div>`
    const temp = document.createElement('div');
    temp.innerHTML = newStateCard;

    const deleteButton = $(temp, ".estado__eliminar");
    const editButton = $(temp, ".estado__editar");
    temp.classList.add("estado");
    temp.id = `state-card-${data.name}`;
    temp.addEventListener("click", selectedState);
    deleteButton.addEventListener("click", deleteState);
    editButton.addEventListener("click", editState);
    return temp;
}

function generateSummaryStateCard(data){
    /* Crea una summary card para un estado recién 
    creado a partir de este */
    const newStateCard = `
        ${data[0].outerHTML}
        <div class="estado__data">
            ${data[1].outerHTML}
        </div>`;
    const temp = document.createElement('div');
    temp.classList.add("estado");
    temp.classList.add("summary");
    temp.innerHTML = newStateCard;
    temp.addEventListener("click", addElementSelected);
    temp.id = `summary-card-${data[1].textContent}`;
    return temp;
}

function cellModeOn(cell) {
    /* Agrega las funcionalidades a las celdas para realizar 
    la definición de áreas de estado */
    cell.addEventListener("click", individualSelect);
    cell.addEventListener("mouseenter", multiSelect);
    cell.addEventListener("mouseleave", setAnterior);
}

function cellsModeOff(cell){
    /* Elimina las funcionalidades de las celdas para realizar 
    la definición de áreas de estado */
    cell.removeEventListener("click", individualSelect);
    cell.removeEventListener("mouseenter", multiSelect);
    cell.removeEventListener("mouseleave", setAnterior);
}

function individualSelect(e) {
    /* Se ejecuta cuando el usuario da click sobre una celda. */
    if (mode === 1) {
        /* en caso de que el usuario haya seleccionado la 
        selección individual */
        const cellid = getIntId(e.target);
        if (!e.target.style.backgroundColor) {
            e.target.style.backgroundColor = color;
            selectedArea.push(cellid);
        }
    }
    if (mode === 2) {
        /* en caso de que el usuario haya seleccionado la 
        selección múltiple */
        const cellid = getIntId(e.target);
        if (!e.target.style.backgroundColor) {
            e.target.style.backgroundColor = selectionColor;
        }
        selectedItems.push([cellid]);
        inicio = getIntId(e.target);
        actual = getIntId(e.target);
        mode = 3;
    }
    else if (mode === 3) {
        /* Finaliza la selección múltiple */
        mode = 2;
        selectedItems.forEach(x => {
            x.forEach(y => {
                const cell = matriz[y[0]][y[1]];
                if (cell.style.backgroundColor === selectionColor) {
                    cell.style.backgroundColor = color;
                    selectedArea.push(y);
                }
            });
        });
        selectedItems = [];
    }
    else if (mode === 4) {
        /* eliminar celda individual de la selección */
        const cellid = getIntId(e.target);
        if (e.target.style.backgroundColor === color) {
            e.target.style.backgroundColor = "";
            const index = IsItemInTheArray(selectedArea, cellid);
            selectedArea = removeValueFromArray(selectedArea, index);
        }
    }
}

function multiSelect(e) {
    /* Agrega los elementos a la selección múltiple cúando pasas
    el mouse sobre ellos */
    if (!(mode === 3)) {
        return 0;
    }
    /* elemento sobre el que está posicionado el cursor */
    actual = getIntId(e.target);

    /* Verefica cuántas columnas y cuántas filas hay de 
    diferencia entre el punto anterior y el actual 
    ambos valores solo pueden ser 0 o cualquier otro núemero 
    entero*/
    const colstoadd = actual[1] - anterior[1];
    const rowstoadd = actual[0] - anterior[0];

    
    /*  las siguientes condiciones nos permiten saber en qué 
    cuadrante se está trabajando teniendo inicio cómo centro. */
    if (anterior[1] === inicio[1]) {
        if (colstoadd > 0) {
            right = true;
        }
        else if (colstoadd < 0) {
            left = true;
        }
    }

    if (anterior[0] === inicio[0]) {
        if (rowstoadd > 0) {
            down = true;
        }
        else if (rowstoadd < 0) {
            up = true;
        }
    }

    /* Una vez determinados los sectores */
    /* Si hay columnas o filas qué agregar a la selección, 
    lo hacemos */
    if (rowstoadd) {
        if (up) {
            addUpRow(rowstoadd);
        }
        else if (down) {
            addDownRow(rowstoadd);
        }
    }
    if (colstoadd) {
        if (right) {
            addRightColumn(colstoadd);
        }
        else if (left) {
            addLeftColumn(colstoadd);
        }
    }

    /* Las siguientes condiciones nos permiten saber si el 
    cursor está posicionado sobre alguno de los ejes o sobre el
    origen (inicio) */
    if (actual[1] === inicio[1]) {
        right = false;
        left = false;
    }

    if (actual[0] === inicio[0]) {
        up = false;
        down = false;
    }
}

function setAnterior(e) {
    /* Hace que la celda actual se vuelva la anterior cuando 
    el cursor abandona su posición sobre ella */
    if (mode === 3) {
        anterior = getIntId(e.target);
    }
}

function addRightColumn(colstoadd) {
    /*
    * Función de agregar columnas que toma por defecto +1 
    * para agregar una nueva columna
    */
    if (colstoadd > 0) {
        for (let i = 1; i <= colstoadd; i++) {
            selectedItems.forEach(x => {
                let cellid = x.slice(-1)[0];
                let newcell = matriz[cellid[0]][cellid[1] + 1];
                //solo rellena si no tiene color
                if (!newcell.style.backgroundColor) {
                    newcell.style.backgroundColor = selectionColor;
                }

                x.push([cellid[0], cellid[1] + 1]);
            });
        }
    }
    /*
    * Función de eliminar columnas que toma por defecto -1 
    * para eliminar una columna
    */
    else if (colstoadd < 0) {
        const difInicio = anterior[1] + colstoadd;
        let changeDirection = false;

        if (inicio[1] > difInicio) {
            colstoadd = inicio[1] - anterior[1];
            changeDirection = true;
        }

        for (let i = -1; i >= colstoadd; i--) {
            selectedItems.forEach(x => {
                const cellid = x.pop();
                const cell = matriz[cellid[0]][cellid[1]];
                // solo elimina el color si la celda se encontraba iluminada
                // por multiseleccion
                if (cell.style.backgroundColor === selectionColor) {
                    cell.style.backgroundColor = "";
                }
            });
        }

        if (changeDirection) {
            const addcols = difInicio - inicio[1];
            right = false;
            left = true;
            addLeftColumn(addcols);
        }
    }
}

function addLeftColumn(colstoadd) {
    /*
    * Función de agregar columnas que toma por defecto -1 
    * para agregar una nueva columna
    */

    if (colstoadd < 0) {
        for (let i = -1; i >= colstoadd; i--) {
            selectedItems.forEach(x => {
                let cellid = x.slice(-1)[0];
                let newcell = matriz[cellid[0]][cellid[1] - 1];

                if (!newcell.style.backgroundColor) {
                    newcell.style.backgroundColor = selectionColor;
                }

                x.push([cellid[0], cellid[1] - 1]);
            });
        }
    }

    /*
    * Función de eliminar columnas que toma por defecto 1 
    * para eliminar una columna
    */

    else if (colstoadd > 0) {
        const difInicio = anterior[1] + colstoadd;
        let changeDirection = false;

        if (inicio[1] < difInicio) {
            colstoadd = inicio[1] - anterior[1];
            changeDirection = true;
        }

        for (let i = 1; i <= colstoadd; i++) {
            selectedItems.forEach(x => {
                const cellid = x.pop();
                const cell = matriz[cellid[0]][cellid[1]];

                if (cell.style.backgroundColor === selectionColor) {
                    cell.style.backgroundColor = "";
                }

            });
        }

        if (changeDirection) {
            const addcols = difInicio - inicio[1];
            right = true;
            left = false;
            addRightColumn(addcols);
        }

    }
}

function addDownRow(rowstoadd) {
    /*
    * Función de agregar filas que toma por defecto +1 
    * para agregar una nueva fila
    */

    if (rowstoadd > 0) {
        for (let i = 1; i <= rowstoadd; i++) {
            let lastrow = selectedItems.slice(-1)[0];
            let newrow = [];
            lastrow.forEach(x => {
                newrow.push([x[0] + 1, x[1]]);
                const newcell = matriz[x[0] + 1][x[1]];

                if (!newcell.style.backgroundColor) {
                    newcell.style.backgroundColor = selectionColor;
                }

            });
            selectedItems.push(newrow);
        }
    }

    /*
    * Función de eliminar filas que toma por defecto -1 
    * para eliminar una fila
    */

    else if (rowstoadd < 0) {
        const difInicio = anterior[0] + rowstoadd;
        let changeDirection = false;

        if (inicio[0] > difInicio) {
            rowstoadd = inicio[0] - anterior[0];
            changeDirection = true;
        }

        for (let i = -1; i >= rowstoadd; i--) {
            let lastrow = selectedItems.pop();
            lastrow.forEach(x => {
                const cell = matriz[x[0]][x[1]];

                if (cell.style.backgroundColor === selectionColor) {
                    cell.style.backgroundColor = "";
                }

            });
        }

        if (changeDirection) {
            const addrows = difInicio - inicio[0];
            down = false;
            up = true;
            addUpRow(addrows);
        }
    }
}

function addUpRow(rowstoadd) {
    /*
    * Función de agregar filas que toma por defecto -1 
    * para agregar una nueva fila
    */

    if (rowstoadd < 0) {
        for (let i = -1; i >= rowstoadd; i--) {
            let lastrow = selectedItems.slice(-1)[0];
            let newrow = [];
            lastrow.forEach(x => {
                newrow.push([x[0] - 1, x[1]]);
                const newcell = matriz[x[0] - 1][x[1]];

                if (!newcell.style.backgroundColor) {
                    newcell.style.backgroundColor = selectionColor;
                }
            });
            selectedItems.push(newrow);
        }
    }

    /*
    * Función de eliminar filas que toma por defecto 1 
    * para eliminar una fila
    */

    else if (rowstoadd > 0) {
        const difInicio = anterior[0] + rowstoadd;
        let changeDirection = false;

        if (inicio[0] < difInicio) {
            rowstoadd = inicio[0] - anterior[0];
            changeDirection = true;
        }

        for (let i = 1; i <= rowstoadd; i++) {
            let lastrow = selectedItems.pop();
            lastrow.forEach(x => {
                const cell = matriz[x[0]][x[1]];
                if (cell.style.backgroundColor === selectionColor) {
                    cell.style.backgroundColor = "";
                }
            });
        }

        if (changeDirection) {
            const addrows = difInicio - inicio[0];
            down = true;
            up = false;
            addDownRow(addrows);
        }
    }
}

function restartToolButtons(){
    /* reinicia la sección de herramientas deseleccionando 
    cualquier herramienta. */
    switch (mode) {
        case 1:
            indSelectButton.classList.remove("--active-button2");
            break;
        case 2:
            multiSelectButton.classList.remove("--active-button2");
            break;
        case 3:
            multiSelectButton.classList.remove("--active-button2");
            selectedItems.forEach(x => {
                x.forEach(y => {
                    const cell = matriz[y[0]][y[1]];
                    if (cell.style.backgroundColor === selectionColor) {
                        cell.style.backgroundColor = "";
                    }
                });
            });
            selectedItems = [];
            break;
        case 4:
            deleteButton.classList.remove("--active-button2");
            unHighlightState();
            break;
        default:
            break;
    }
    mode = 0;
}

function changeActiveButton(e) {
    /* Resalta el botón de herramienta seleccionada */
    restartToolButtons();
    if(error){
        /* En caso de que el color seleccionado no sea válido,  
        no se activará ninguna herramienta y se notificará.*/
        notifyUser(10);
        return 0;
    }
    switch (e.target.classList[0]) {
        case "ind-select":
            indSelectButton.classList.add("--active-button2");
            mode = 1;
            break;
        case "multi-select":
            multiSelectButton.classList.add("--active-button2");
            mode = 2;
            break;
        case "delete-button":
            if (selectedArea.length > 0){
                highlightState(selectedArea);
            }
            deleteButton.classList.add("--active-button2");
            mode = 4;
            break;
        case "trash-button":
            trashButton.classList.add("--active-button2");
            discardSelectedArea();
            trashButton.classList.remove("--active-button2");
            mode = 0;
            break;
    }
}

function returnToOverViewSave(){
    /* Ejecuta la función de agregar nuevo estado y luego 
    regresa a la página overview */
    let result = 1;

    if(listView.classList.length !== 0){
        listView.click();
    }

    result = addNewState();

    if (!result){
        return 0;
    }
    returnToOverView(null, 1);
}

function activateListView() {
    /* Activa o desactiva la lista de visualización en 
    el área de creación de estados */
    if (listView.classList.toggle("--list-view")) {
        /* renderizado de la lista de visualización. */
        renderListView();
    }
    else {
        /* renderizado de la lista de formulario de 
        estados */
        renderStateForm();
    }
}

function renderListView(){
    /* Renderizado de la lista de visualización */
    headerPage.textContent = "List of states";
    statesArea.removeChild(formulario);
    statesArea.removeChild(toolsSect);
    statesArea.removeChild(mainButtons);

    if (Object.keys(states).length === 0) {
        /* Si no hay estados, se imprime el mensaje de que no 
        se ha creado ninguno. */
        const emptyListMsg = emptyListViewerMessage(1);
        statesArea.appendChild(emptyListMsg);
    }
    else {
        /* Si hay estados, se despliega la lista 
        de visualización */
        statesArea.appendChild(stateListViewer);
    }
}

function renderStateForm(){
    /* Renderiza el formulario de creación de estados */
    headerPage.textContent = elementToEdit ? elementToEdit.name : "New State";

    /* Si hay un elemento seleccionado en 
    la lista de visualización, lo deselecciona */
    if (selectedItemList){
        selectedItemList.click();
    } 
    statesArea.appendChild(formulario);
    statesArea.appendChild(toolsSect);
    statesArea.appendChild(mainButtons);

    const noStatesMessage = $(statesArea, "#noStatesMessage");
    if (noStatesMessage) {
        /* Si no había estados creados, elimina el mensaje
        de "no has creado ningún estado aún." */
        noStatesMessage.remove();
    } else {
        /* Si había estados, quita la lista de visualización */
        stateListViewer.remove();
    }
}

export function emptyListViewerMessage(opt){
    /* Crea el mensaje de ningún elemento creado ya sea para 
    la lista de visualización de estados o eventos. */
    const msg = document.createElement("h3")
    msg.textContent = opt ? "You haven't created any state yet" :
                            "You haven't created any activity yet";
    msg.classList.add("self-aling-center");
    msg.id = "noStatesMessage";
    return msg;
}

async function returnToOverView(e, save=0){
    /* Volver a la página de overview desde el workspace */

    if (selectedItemList){
        /* Si hay un elemento seleccionado de la 
        lista de visualiación, lo deselecciona */
        selectedItemList.click();
    }
    if (!save){
        /* Si la función fue llamada desde el botón 
        "Volver" elimina mensaje de éxito*/
        const msgSucc = $(inspectionArea, ".user__success");
        if (msgSucc){
            msgSucc.remove();
        }
    }

    /* Eimina todos los mensajes de error */
    inspectionArea.querySelectorAll(".user__error")
                    .forEach(x=>{x.remove();});

    if (listView.classList.length !== 0){
        /* Si la lista de visualización está desplegada, 
        la retrae */
        listView.click();
    }
    if (elementToEdit){
        /* Si está en modo de edición, da click en el botón
        cancelar */
        $(statesArea, "#boton-cancelar").click();
    }

    if (selectedArea.length > 0){
        /* Si había una selección de área hecha, pregunta al 
        usuario si está seguro de querer perderla */
        const result = await warningProgressLoss();

        if (!result){
            /* Si el usuario responde no quiere perder 
            la selección hecha, cancela el proceso*/
            return 0;
        }

    }

    /* Finaliza proceso y vuelve mostrar la página overview */
    setDefaultValues();

    selectionGridForOverview();

    buildOverviewPage();

    discardSelectedArea();
}

function discardSelectedArea(){
    /* Desecha la selección realizada */
    colorArea(selectedArea, "");
    selectedArea = [];
}

function colorArea(area, color){
    /* Elimina color en un área determinada */
    area.forEach(x => {
        const cell = matriz[x[0]][x[1]];
        cell.style.backgroundColor = color;
    });
}

function deleteState(){
    /* Eliminar estado */
    const stateToDelete = this.parentElement.parentElement;
    const stateKey = $(stateToDelete, "h4").textContent;

    const summaryCardId = `#summary-card-${stateKey}`;
    const summaryCardToDelete = $(summaryStateList, summaryCardId);

    summaryCardToDelete.remove();

    const stateColor = states[stateKey].colorRgba;
    const stateArea = states[stateKey].area;

    removeElement(usedNames, stateKey);

    removeElement(usedColors, stateColor);

    colorArea(stateArea, "");

    const stateUsedIn = states[stateKey].usedIn;

    stateUsedIn.forEach(x=>{
        deleteStateInEventCard(x, stateKey);
    });

    delete states[stateKey];
    stateToDelete.remove();
}

function deleteStateInEventCard(eventName, stateKey){
    /* Elimina el nombre de estado en las event cards
    que aparecía. */
    let eventCompList = events[eventName].eventComp;
    const i = eventCompList.indexOf(stateKey);
    eventCompList = removeValueFromArray(eventCompList, i);
    const eventCard = $(eventListViewer, `#event-card-${eventName}`);
    if (eventCompList.length === 0){
        $(eventCard, ".estado__eliminar").click();
    }
    else {
        const compList = $(eventCard, ".estado__color-text");
        compList.textContent = eventCompList.join(", "); 
    }
}

function editState(){
    /* Activa el modo de edición para estados */

    discardSelectedArea();

    const stateCard = this.parentElement.parentElement;
    const stateKey = $(stateCard, "h4").textContent;
    const state = states[stateKey];

    this.parentElement.classList.add("--invisible-element");

    const stateColor = state.colorRgba;

    originalIndex = usedNames.indexOf(stateKey);
    usedNames[originalIndex] = "";

    removeElement(usedColors, stateColor);

    const label = createEditingLabel();
    stateCard.appendChild(label);

    setElementToEdit(state);

    statesArea.remove();

    displayStatesWorkspace();

    const cancelbutton = createCancelButton();
    cancelbutton.addEventListener("click", cancelEditState);
    mainButtons.appendChild(cancelbutton);

    $(botonAgregar, "p").textContent = "Actualizar";
    selectedArea = [...state.area];

    setDefaultValues(state.name, state.opacity, state.color);
}

function createCancelButton (){
    /* Crea al botón de cancelar para el modo de edición */
    const cancelbutton = document.createElement("button");
    cancelbutton.classList.add("agregar-boton");
    cancelbutton.id = "boton-cancelar";
    cancelbutton.innerHTML =`<p>Cancel</p>`;
    return cancelbutton;
}

function createEditingLabel(){
    /* Crea la etiqueta de "editando" */
    const label = document.createElement("div");
    label.classList.add("editing-state-label");
    label.textContent = "Editing";
    return label;
}

function cancelEditState(){
    /* Cancela la edición y desactiva el modo edición */
    trashButton.click();

    const elementToEditArea = elementToEdit.area;
    const elementToEditColor = elementToEdit.colorRgba;

    colorArea(elementToEditArea, elementToEditColor);

    usedNames.push(elementToEdit.name);
    usedColors.push(elementToEdit.colorRgba);

    setSelectedItemList("");
    editStateExit();
    setDefaultValues();
}

function editStateExit(){
    /* Sale del modo de edición hacia el workspace */
    headerPage.textContent = "New State";

    stateListViewer.querySelectorAll(".cover-up-grid").forEach(x=>{
        x.parentElement.addEventListener("click", selectedState);
        x.remove();
    });
    const selectedCard = $(stateListViewer, ".--selected-state");
    const invisible = $(selectedCard, ".--invisible-element");
    const editLabel = $(selectedCard, ".editing-state-label");
    const botonCancelar = $(mainButtons, "#boton-cancelar");
    const botonAgregarTxt = $(botonAgregar, "p");

    selectedCard.addEventListener("click", selectedState);
    editLabel.remove();
    invisible.classList.remove("--invisible-element");
    selectedCard.click();
    botonCancelar.remove();
    botonAgregarTxt.textContent = "Add a new state";

    setElementToEdit("");
}

function disableRemainingStates(){
    /* Deshabilita las tarjetas de los estados que no fueron 
    seleccionados */
    stateListViewer.childNodes.forEach(x=>{
        x.removeEventListener("click", selectedState);
        if (![...x.classList].includes("--selected-state")){
            const coverUp = document.createElement("div");
            coverUp.classList.add("cover-up-grid");
            x.appendChild(coverUp);
        }
    });
}

function selectedState() {
    /* Marca como seleccionada una state card cuando se
    da click sobre ella */
    if (selectedItemList && selectedItemList != this){
        selectedItemList.classList.remove("--selected-state");
        unHighlightState();
    }
    if(this.classList.toggle("--selected-state")){
        setSelectedItemList(this);
        const tittle = $(this, ".estado__titulo").textContent;
    
        if (elementToEdit){
            disableRemainingStates();
            return 0;
        }
        if (!states[tittle]){
            return 0;
        }
        let stateArea = states[tittle].area
        highlightState(stateArea);
    }
    else {
        setSelectedItemList("");
        unHighlightState();
    }
}

export function highlightState(stateArea){
    /* Resalta el estado seleccionado */
    matriz.forEach(y=>{
        y.forEach(x => {
            const id = getIntId(x)
            if(IsItemInTheArray(stateArea, id) === -1){
                if (x.style.backgroundColor === "rgba(255, 255, 255, 0.35)"){
                    x.style.backgroundColor = "";
                }
                x.classList.add("not-selected");
                cellsModeOff(x);
            }
        })
    });
    selectedItems = [];
    const activeTool = toolsSect.querySelector(".--active-button2");
    if (activeTool){
        activeTool.classList.remove("--active-button2");
    }
    mode = 0;
}

export function unHighlightState(){
    /* Dejar de resaltar un estado previamente seleccionado */
    let notSelectedArea = document.querySelector(".container").querySelectorAll(".not-selected");
    notSelectedArea.forEach(x=>{
        x.classList.remove("not-selected");
        cellModeOn(x);
    });
}