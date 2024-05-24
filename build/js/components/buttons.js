export const rightButtons = document.createElement("div");
rightButtons.classList.add("right-buttons");

export const homeButton = `<a class="home-button" href="#">
                        <img src="build/img/inicio.svg" alt="boton inicio">
                    </a>`

export const discardButton = `<div class="icon-text-button" id="discard-button">
                        <a href="#">
                            <h4>Delete all</h4>
                            <img src="build/img/trash.svg" alt="desechar todo">
                        </a>
                    </div>`

export const downloadButton = `<div class="icon-text-button" id="download-button">
                            <a href="#">
                                <h4>Create new Script</h4>
                                <img src="build/img/download.svg" alt="descargar script">
                            </a>
                        </div>`

export const backButton = `<div class="icon-text-button" id="regresar-boton">
                        <a href="#">
                            <img src="build/img/back-arrow.svg" alt="boton regresar">
                            <h4>Back</h4>
                        </a>
                    </div>`

export const doneButton = `<div class="icon-text-button" id="guardar-boton">
                        <a href="#">
                            <h4>Save and Exit</h4>
                            <img src="build/img/front-arrow.svg" alt="siguiente">
                        </a>
                    </div>`

export const userUpload = `<div class="selector-archivos">
                        <h1>SEL scripts</h1>
                        <h3>Create your SEL script Easy and fast!</h3>
                        <label for="input-file" class = "custom-file-boton"> Select one Image </label>
                        <h3>Drag and drop the image here</h3>
                        <input id="input-file" type="file" accept="image/png, image/jpeg">
                    </div>` 

export const eventsAreaAgregarBoton = `<button class="agregar-boton" id="boton-agregar">
                                        <p>Add a new activity</p>
                                        </button>`

export const mainButtons = document.createElement("div");
mainButtons.classList.add("main-buttons");