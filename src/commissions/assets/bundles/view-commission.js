import "../components/tag"
import "../components/event-card"
import "@index/components/tooltip"

let COM = null

document.addEventListener("DOMContentLoaded", () => {

    if(document.getElementById("commission-json")){
        COM = JSON.parse(document.getElementById("commission-json").innerHTML)
    }

    if(COM && COM.organization_dependant === "bds" && document.getElementById("member-join")){
        document.getElementById("member-join").addEventListener("click", e => {
            e.preventDefault()
            document.getElementById("join-bds").open()
        })
    }

});

