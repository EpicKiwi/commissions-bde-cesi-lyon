import {LitElement, html} from 'lit-element';
import SimpleMDE from "simplemde"
import apiClient from "@index/libs/apiClient"

const IMAGE_MIMES = ["image/gif", "image/jpeg", "image/png", "image/webp", "image/svg+xml"]

class Markdown extends LitElement {

    static get properties(){
        return {
        }
    }

    firstUpdated(){
        requestAnimationFrame(() => {
            this.textarea = this.querySelector("textarea")
            this.simplemde = new SimpleMDE({
                element: this.textarea,
                spellChecker: false
            });
            this.simplemde.codemirror.on("drop", (...e) => this.drop(e[1], e[0]))
        })
    }

    selectFile(e){
        e.preventDefault()
        this.shadowRoot.getElementById("file-field").click()
    }

    fileInputChanged(e){
        let files = this.shadowRoot.getElementById("file-field").files
        Array.from(files).forEach(el => this.uploadFile(el))
        this.shadowRoot.getElementById("file-field").value = ""
    }

    async uploadFile(file, position=null){
        this.uploadNumber = this.uploadNumber ? this.uploadNumber + 1 : 1
        let uploadingTxt = this.getFileText(file, `Téléversement de ${file.name}...`, `#${this.uploadNumber}`)

        let mddoc = this.simplemde.codemirror.getDoc()
        if(position){
            mddoc.replaceRange(uploadingTxt,position)
        } else {
            mddoc.replaceSelection(uploadingTxt, "start")
        }

        let upload = null
        try {
            upload = await apiClient.createUpload(file)
        } catch(e) {
            console.error(e)
            let errorTxt = this.getFileText(file, `Echec du téléversement de ${file.name}`)
            this.simplemde.value(this.simplemde.value().replace(uploadingTxt, errorTxt))
            return
        }

        let finishedTxt = this.getFileText(file, file.name, upload.file)
        this.simplemde.value(this.simplemde.value().replace(uploadingTxt, finishedTxt))
    }

    getFileText(file, title="", url=""){
        let text = `[${title}](${url})`
        if(IMAGE_MIMES.indexOf(file.type.toLowerCase()) > -1){
            text = "!"+text
        }
        return text
    }

    drop(e, cm){
        let coords = cm.coordsChar({
            left: e.pageX,
            top: e.pageY
        });
        console.log(e)
        Array.from(e.dataTransfer.files).forEach(el => this.uploadFile(el, coords))
    }

    render() {
        return html`
            <style>
                .upload-tip {
                    border: 1px solid #bbb;
                    border-radius: 4px;
                    padding: 10px;
                    margin: 5px 0;
                    font-size: 12px;
                    color: #2f2f2f;
                    line-height: 15px;
                }
                
                .upload-tip a {
                    color: #2f2f2f
                }
                
                .upload-tip bde-icon {
                    font-size: 15px;
                }
                
                .hidden-file-field {
                    display: none;
                }
            </style>

            <slot></slot>
            <div class="upload-tip">
                <bde-icon icon="mdi-upload"></bde-icon> Envoie un fichier en le déposant sur l'éditeur ou <a href="#" @click="${this.selectFile}">clique ici pour le selectionner</a>
                <input type="file" class="hidden-file-field" id="file-field" multiple @change="${this.fileInputChanged}"/>
            </div>
        `
    }

}

customElements.define('bde-markdown', Markdown);