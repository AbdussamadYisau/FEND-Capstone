import {performAction} from "./handleSubmitOne";

const submit = document.querySelector("#submitForm");

submit.addEventListener("click", performAction);

export {
    submit
}