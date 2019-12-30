(() => {

    let submitButton = null
    let form = null
    let presidentField = null
    let initialPresidentField = null
    let modal = null
    let modalField = null
    let modalSubmitBtn = null

    function initForm(){
        submitButton = document.getElementById("save-button")
        form = document.getElementById("com-form")

        presidentField = document.getElementById("id_president")
        modal = document.getElementById("president-changed-modal")
        initialPresidentField = modal.getAttribute("data-initialpresident")

        modalField = document.getElementById("validation-form")
        modalField.addEventListener("change", modalCheckName)
        modalField.addEventListener("keyup", modalCheckName)
        modalSubmitBtn = document.getElementById("modal-submit")
        modalSubmitBtn.addEventListener("click", modalSubmit)
        document.getElementById("modal-cancel").addEventListener("click", () => resetPresident())

        submitButton.addEventListener("click", submitForm)
        Array.from(form.querySelectorAll("input, select, textarea"))
            .forEach(el => {
                el.addEventListener("change", enableSave)
                el.addEventListener("keyup", enableSave)
            })

    }

    function submitForm(event){
        if(event.target.disabled)
            return
        if(presidentField.value != initialPresidentField){
            modal.querySelector("#new-president").innerHTML = presidentField.options[presidentField.selectedIndex].getAttribute("data-name")
            modal.open()
        } else {
            form.submit()
        }
    }

    function modalCheckName(){
        let text = document.getElementById("commission-name").innerHTML.toLowerCase()
        if(modalField.value.toLowerCase() == text){
            modalSubmitBtn.disabled = false
        } else {
            modalSubmitBtn.disabled = true
        }
    }

    function resetPresident(){
        presidentField.value = initialPresidentField
        presidentField.dispatchEvent(new Event("change"))
        modal.close()
    }

    function modalSubmit(event){
        if(event.target.disabled)
            return
        form.submit()
    }

    function enableSave(e){
        if(submitButton.disabled)
            submitButton.parentElement.pulse()
        submitButton.disabled = false
    }

    function wantKickUser(id,name){
        let modal = document.getElementById("kick-member-modal")

        Array.from(modal.querySelectorAll(".member-name")).forEach(el => el.innerHTML = name)
        modal.querySelector(".member-id").value = id

        modal.open()

    }

    function wantDemoteUser(id,name){
        let modal = document.getElementById("demote-member-modal")

        Array.from(modal.querySelectorAll(".member-name")).forEach(el => el.innerHTML = name)
        modal.querySelector(".member-id").value = id

        modal.open()

    }

    function wantPromoteUser(id,name){
        let modal = document.getElementById("promote-member-modal")

        Array.from(modal.querySelectorAll(".member-name")).forEach(el => el.innerHTML = name)
        modal.querySelector(".member-id").value = id

        modal.open()

        modal.querySelector(".modal-cancel").addEventListener("click", e => {
            e.preventDefault()
            modal.close()
        })

    }

    let membersInitialized = false

    function initMembers(){

        if(membersInitialized)
            return
        else
            membersInitialized = true

        Array.from(document.querySelectorAll(".member")).forEach( el => {
            let id = el.dataset.id
            let name = el.dataset.name

            el.querySelector(".kick").addEventListener("click", e => wantKickUser(id, name) )
            let promoteBtn = el.querySelector(".promote")
            if(promoteBtn)
                promoteBtn.addEventListener("click", e => wantPromoteUser(id, name) )
            let demoteBtn = el.querySelector(".demote")
            if(demoteBtn)
                demoteBtn.addEventListener("click", e => wantDemoteUser(id, name) )
        })

        let kickModal = document.getElementById("kick-member-modal")
        kickModal.querySelector(".modal-cancel").addEventListener("click", e => {
            e.preventDefault()
            kickModal.close()
        })

        let demoteModal = document.getElementById("demote-member-modal")
        demoteModal.querySelector(".modal-cancel").addEventListener("click", e => {
            e.preventDefault()
            demoteModal.close()
        })

        let promoteModal = document.getElementById("kick-member-modal")
        promoteModal.querySelector(".modal-cancel").addEventListener("click", e => {
            e.preventDefault()
            kickModal.close()
        })
    }

    document.addEventListener("DOMContentLoaded",initForm);
    document.addEventListener("DOMContentLoaded",initMembers);

})()