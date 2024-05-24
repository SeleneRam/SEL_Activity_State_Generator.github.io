import { eventsAreaAgregarBoton, backButton, 
        doneButton, rightButtons, mainButtons} from "./buttons.js";

import { sectionsArea } from "./overview.js";

import { mainSpace } from "./docStruct.js";

//FOR WORKSPACE STATES
export let botonAgregar = ""; //ESTA VARIABLE SE COMPARTE CON EVENTS
export let listView = "";  //ESTA TAMBIÉN SE COMPARTE CON EVENTS
export let guardarboton = ""; //SE COMPARTE CON EVENTS
export let volverButton = ""; //SE COMPARTE CON EVENTS

export let formulario = ""; //SE COMPARTE CON EVENTS

export let elementToEdit = ""; //SE COMPARTE CON EVENTS

// FOR WORKSPACE EVENTS
export let summaryStateList = document.createElement("div");
summaryStateList.classList.add("summary-list");


//workspace structure html
export const statesArea = document.createElement("div");
statesArea.classList.add("states-area");

export const headerStatesArea = `<div class="header-states-area">
                            <h2>New State</h2>
                            <a href="#" id="list-view">
                                <img src="build/img/list-icon.svg" alt="lista">
                            </a>
                        </div><!--header-->`

export const headerEventsArea = `<div class="header-states-area">
                            <h2>New Activity</h2>
                            <a href="#" id="list-view">
                                <img src="build/img/list-icon.svg" alt="lista">
                            </a>
                        </div><!--header-->`

export const statesAreaForm = `<form class="formulario">
                            <fieldset>
                                <legend>State Name</legend>
                                <input type="text" name="nombre" id="name">
                            </fieldset>
                            <fieldset>
                                <legend>Color</legend>
                                <input type="text" name="colorValue" id="selected-color"disabled>
                                <input type="color" name="color" id="color-picker">
                            </fieldset>
                            <fieldset>
                                <legend>Opacity</legend>
                                <input type="range" name="opacidad" min="0" max="1" step="0.01" id="opacity-picker">
                                <label id="selected-opacity">0.00</label>
                            </fieldset>
                        </form> <!--Formulario-->`
export const eventsAreaForm = `<form class="formulario">
                            <fieldset class="event-name-input">
                                <legend>Activity Name</legend>
                                <input type="text" name="nombre" id="name">
                            </fieldset>
                            <fieldset class="event-type-containers">
                                <legend>Motion Primitive</legend>
                                <div class="event-type-section">
                                    <button class="event-button" id="parallel-button">
                                        <img  src="build/img/parallel.svg" alt="paralelismo">
                                        <p>Parallel</p>
                                    </button>
                                    <button class="event-button" id="concurrency-button">
                                        <img src="build/img/concurrency.svg" alt="concurrencia">
                                        <p>Concurrency</p>
                                    </button>
                                    <button class="event-button" id="sequency-button">
                                        <img  src="build/img/sequency.svg" alt="secuencia">
                                        <p>Sequence</p>
                                    </button>
                                </div> <!--event-type-section-->
                            </fieldset>
                            <fieldset class="list-elements event-elements-viewer">
                                <legend>States</legend>
                                <div class="components-list">
                                </div>
                                <div class="cover-up"></div>
                            </fieldset> <!--list-elements-->
                            </form> <!--Formulario-->`

export const statesAreaTools = `<div class="tools-section">
                            <button class="ind-select tool-button ind-select" id="ind-select">
                                <img class="ind-select" src="build/img/individual-select.svg" alt="seccion de estados">
                                <p class="ind-select">Select</p>
                            </button>
                            <button class="multi-select tool-button" id="multi-select">
                                <img class="multi-select"src="build/img/multi-select.svg" alt="seccion de estados">
                                <p class="multi-select">Multiple</p>
                            </button>
                            <button class="delete-button tool-button" id="delete-button">
                                <img class="delete-button" src="build/img/delete.svg" alt="seccion de estados">
                                <p class="delete-button">Delete</p>
                            </button>
                            <button class="trash-button tool-button" id="trash-button">
                                <img class="trash-button" src="build/img/trash.svg" alt="seccion de estados">
                                <p class="trash-button">Delete <br> selection</p>
                            </button>
                        </div> <!--Tool-section-->`

export const statesAreaAgregarBoton = `<button class="agregar-boton" id="boton-agregar">
                                <p>Add a new state</p>
                                </button>`

export function removeElement(array, element){
    const index = array.indexOf(element); 
    const newArray = removeValueFromArray(array, index);
    return newArray;
}

export function removeValueFromArray(array, index){
    if (index > -1) { // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
    }
    return array;
}

export function IsItemInTheArray(array, item) {
    for (let i = 0; i < array.length; i++) {
        const a = array[i];
        if (a[0] === item[0] && a[1] === item[1]) {
            return i;
        }
    }
    return -1;
}

export function $ (parent, element){
    return parent.querySelector(element);
}

export function getIntId(e) {
    return e.id.split(",").map(x => parseInt(x));
}

export function setElementToEdit(value){
    elementToEdit = value;
}

export function buildWorkspace(opt){
    /* En función de opt (0 o 1) renderiza el espacio 
    de trabajo correspondiente a la sección seleccionada.
    Siendo 0: eventos y 1: estados */
    const nav = document.querySelector("nav");
    nav.innerHTML = backButton;
    rightButtons.innerHTML = doneButton;
    nav.appendChild(rightButtons);
    sectionsArea.remove();

    mainSpace.appendChild(statesArea);

    if (opt){
        statesArea.innerHTML = `${headerStatesArea}\n${statesAreaForm}\n${statesAreaTools}`;
    }
    else {
        statesArea.innerHTML = `${headerEventsArea}\n${eventsAreaForm}`;
        const list = document.querySelector(".components-list");
        list.innerHTML = "";
        list.appendChild(summaryStateList);
    }

    mainButtons.innerHTML = opt  ?  statesAreaAgregarBoton : 
                                    eventsAreaAgregarBoton;

    statesArea.appendChild(mainButtons);

}