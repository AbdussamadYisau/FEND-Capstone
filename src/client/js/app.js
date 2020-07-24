import {handleSubmit, trip_details_section} from "./handleSubmit";

const deleteTrip = document.querySelector("#remove");
const submit = document.querySelector("#submitForm");

function deleteFlight(event) {
    document.querySelector("#tripForm");
    tripDetails.classList.add("invisible");
    location.reload();
}


deleteTrip.addEventListener("click", deleteFlight);
submit.addEventListener("click", handleSubmit);

export {
    deleteTrip
}