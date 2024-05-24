import { navbar, mainSpace, footer } from "../components/docStruct.js";
import { userUpload } from "../components/buttons.js";
import { showOverview } from "../components/overview.js";

const body = document.querySelector("body");

let imageUrl = "";
export let userImgElement = null;

let imgwidth = 0;
let imgheight = 0;

export function showInitialPage(){
    //Creacion de navbar
    body.appendChild(navbar);
    navbar.innerHTML = "";
    const nav = document.createElement("nav");
    nav.classList.add("nav-inicio");
    navbar.appendChild(nav);

    //Creacion de Inicio Main (UserUpload)
    mainSpace.removeAttribute("class"); 
    mainSpace.classList.add("contenido-principal");
    mainSpace.innerHTML = userUpload;
    body.appendChild(mainSpace);
    
    //Agregar el footer
    body.appendChild(footer);
    //for dev uncomment the next line:
    //body.querySelector(".custom-file-boton").addEventListener("click", showOverview);
    let fileInput = document.getElementById('input-file');
    let dropArea = document.querySelector(".selector-archivos");
    dropArea.addEventListener("dragover", (e)=>{e.preventDefault();});
    dropArea.addEventListener("drop", dropUserImg);
    fileInput.addEventListener("change", uploadUserImg);
}

function dropUserImg(e){
    e.preventDefault();
    let files = e.dataTransfer.files;
    let file = files[0];
    getUserImgData(file);
}

function uploadUserImg (e){
    let file = e.target.files[0];
    getUserImgData(file);
}

function getUserImgData(file){
    if (file && file.type.startsWith('image/')){
        let reader = new FileReader();
        reader.onload = function(e){
            imageUrl = e.target.result;
            userImgElement = document.createElement('img');
            userImgElement.classList.add("visualizer-container");
            userImgElement.onload = function (){
                imgwidth = userImgElement.naturalWidth;
                imgheight = userImgElement.naturalHeight;
                showOverview();
            }
            userImgElement.src = imageUrl;
            //body.innerHTML = ""; // Limpia el contenedor de vista previa
            //body.appendChild(imgElement);
        }
        reader.readAsDataURL(file);
    }
}