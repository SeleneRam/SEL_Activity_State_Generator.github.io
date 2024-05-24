export const popUserTittle = ` <div class="user-form">
                        <label for="">Enter script name</label>
                        <input type="text" id="name-module">

                        <label for="">Enter video name</label>
                        <input type="text" id="name-video">

                        <div class="user-form__buttons">
                            <button class="cancel-button">Cancel</button>
                            <button class="accept-button">Accept</button>
                        </div>
                        </div>
                        `;
                        


export const popWarningUseless = ` <div class="user-form">
                        <label for=""> </label>
                        <div class="user-form__buttons">
                            <button class="cancel-button">Cancel</button>
                            <button id="do-not-include"class="accept-button">Do not include</button>
                            <button id="include-state" class="accept-button">Include</button>
                        </div>
                        </div>`;

export const popWarningProgress = ` <div class="user-form">
                        <label for="">If you exit without saving, the current selection will be lost.</label>
                        <div class="user-form__buttons">
                            <button class="cancel-button">Cancel</button>
                            <button class="accept-button">Continue</button>
                        </div>
                        <div class="ban-form">
                            <input type="checkbox" id="dont-show-again" name="dont-show-again">
                            <label for="dont-show-again">Do not show again</label>
                        </div>
                        </div>`;

let dontShowAgain = false;

export function warningProgressLoss(){
    return new Promise ((resolve)=>{
        if (dontShowAgain){
            return resolve(1);
        }
        const backgroundGrey = document.createElement("div");
        backgroundGrey.classList.add("--ask-gb");
        backgroundGrey.innerHTML = popWarningProgress;
        document.querySelector("body").appendChild(backgroundGrey);
        document.querySelector(".cancel-button").addEventListener("click", ()=>{
            backgroundGrey.remove();
            return resolve(0);
        })
        document.querySelector(".accept-button").addEventListener("click", ()=>{
            if (document.getElementById("dont-show-again").checked){
                dontShowAgain = 1;
            }
            backgroundGrey.remove();
            return resolve(1);
        })
    })
}