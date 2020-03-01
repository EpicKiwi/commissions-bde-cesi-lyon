import {LitElement, html} from "lit-element";
import debounce from "lodash.debounce";
import apiClient from "../libs/apiClient"
import "@index/components/quick-link"
import "@commissions/components/event-card"

class SearchBoxComponent extends LitElement {

    static get properties(){ return {
        loading: {type: Boolean},
        search: {type: String},
        results: {type: Object},
        show: {type: Boolean}
    }}

    constructor() {
        super();
        this.search = ""
        this.debouncedPerformSearch = debounce(this.performSearch, 200)
        this.handleHotkey = this.handleHotkey.bind(this)
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener("keyup", this.handleHotkey)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener("keyup", this.handleHotkey)
    }

    handleHotkey(e){
        if(e.keyCode == 16){
            if(this.firstShot){
                this.firstShot = false
                clearTimeout(this.hotkeyTimeout)
                this.clearField()
                this.show = !this.show
            } else {
                this.firstShot = true
                this.hotkeyTimeout = setTimeout(() => this.firstShot = false,300)
            }
        } else if (e.keyCode == 27 && this.show){
            this.clearField()
            this.show = false
        }
    }

    update(changedProperties) {
        super.update(changedProperties)
        if(changedProperties.has("search")){
            if(this.search.trim() !== ""){
                this.debouncedPerformSearch(this.search)
            } else {
                this.results = ""
            }
        }
        if(this.show){
            document.body.classList.add("block-scroll")
            if(changedProperties.has("show")){
                this.shadowRoot.getElementById("input").focus()
            }
        } else {
            document.body.classList.remove("block-scroll")
        }
    }

    attemptHide(){
        if(this.search.trim() == ""){
            this.show = false
        }
    }

    async performSearch(search){
        if(search == "")
            return

        this.results = await (await apiClient.apiGET(`/api/search?q=${encodeURI(this.search)}`)).json()
        console.log(this.results)
    }

    clearField(){
        this.search = "";
        this.results = undefined;
    }

    render() {

        let usersHtml = []
        let commissionsHtml = []
        let documentationHtml = []
        let quicklinkHtml = []
        let eventHtml = []
        let emptyResult = false

        if(this.results) {

            quicklinkHtml = this.results.quicklinks.map(ql => html`
                <bde-quicklink icon="${ql.icon}" style="${ql.style}" href="${ql.url}" >${ql.text}</bde-quicklink>
            `)

            eventHtml = this.results.events.map(eve => html`
                <a href="/commissions/${eve.commission.slug}/event-${eve.slug}" style="display: block; color: inherit; text-decoration: inherit">
                    <bde-event-card eventName="${eve.name}" bannerSrc="${eve.banner || eve.commission.banner}" eventStart="${eve.event_date_start}" eventEnd="${eve.event_date_end}" style="width: 300px" >
                        <span slot="location">${eve.location}</span>
                        <div slot="commission">
                            <bde-compact-commission logo-src="${eve.commission.logo}">${eve.commission.name}</bde-compact-commission>
                        </div>
                    </bde-event-card>
                </a>
            `)

            usersHtml = this.results.users.map(usr => {
                if(usr.profile_picture) {
                    return html`<bde-user href="mailto:${usr.email}" image-src="${usr.profile_picture}" >${usr.first_name} ${usr.last_name}</bde-user>`
                } else {
                    return html`<bde-user href="mailto:${usr.email}" >${usr.first_name} ${usr.last_name}</bde-user>`
                }
            })

            commissionsHtml = this.results.commissions.map( com => {
                return html`
                    <bde-commission-card
                            banner-src="${com.banner}"
                            logo-src="${com.logo}"
                            commission-name="${com.name}"
                            href="/commissions/${com.slug}"
                            organization="${com.organization_dependant}"
                        >${com.short_description}</bde-commission-card>
                `
            })

            documentationHtml = this.results.documentations.map( doc => html`
                <a class="result-link documentation" href="${doc.url}">
                    <h3 class="icon"><bde-icon icon="fa-solid:book"></bde-icon> ${doc.title}</h3>
                    <span class="documentation-path">${doc.url}</span>
                </a>
            `)

            emptyResult = Object.values(this.results).reduce((acc,el) => acc+el.length, 0) == 0
            console.log(emptyResult)
        }

        return html`
        <style>
        
        .search-box {
            position: fixed;
            top: 0;
            left: 0;
            
            width: 100%;
            height: 100vh;
            
            background: rgba(0,0,0,0.8);
            z-index: 2000;
            
            display: flex;
            flex-direction: column;
        }
        
        .search-tips {
            position: absolute;
            left: 50%;
            top: 50%;
            text-align: center;
            color: white;
            transform: translateX(-50%) translateY(-50%);
            font-size: 20px;
            line-height: 150%;
            max-width: 300px;
            opacity: 0.5;
        }
        
        .search-tips h3 {
            font-weight: bolder;
            font-size: 40px;
            margin-botom: 20px;
        }
        
        .search-tips .img-tip img {
            height: 70px;
            display: inline-block;
        }
        
        .search-results {
            flex: 1;
            overflow-y: auto;
            background: var(--bg-color);
            padding-top: 85px;
            position: relative;
        }
        
        .search-results.hidden {
            display: none;
        }
        
        .search-form {
            position: fixed;
            top: 15px;
            left: 50%;
            
            z-index: 2001;
            
            width: calc(100% - 20px);
            max-width: 1000px;
            transform: translateX(-50%);
            
            display: flex;
            flex-direction: row;
            
            background: var(--bg-color);
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        }
        
        .search-form .search-input {
            padding: 15px 0;
            font-size: 20px;
            border: none;
            outline: none;
            flex: 1;
            min-width: 0;
        }
        
        .search-form .search-button {
            font-size: 25px;
            border: none;
            outline: none;
            background: transparent;
            padding: 10px 15px;
        }
        
        .row-results {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            overflow: auto;
            padding: 25px 0;
        }
        
        .row-results::before, .row-results::after {
            content: "";
            min-width: 25px;
            height: 100%;
        }
        
        .row-results > * {
            width: auto;
            margin-right: 25px;
        }
        
        .row-results.reduced-results {
            padding: 10px 0;
        }
        
        .list-results {
            padding: 25px;
        }
        
        .result-link {
            display: block;
        }
        
        .documentation {
            color: var(--text-color);
            text-decoration: none;
            padding: 20px 0;
            border-top: rgba(0,0,0,0.2) solid 1px;
        }
        
        .documentation:last-child {
            border-bottom: rgba(0,0,0,0.2) solid 1px;
        }
        
        .documentation h3 {
            font-size: 25px;
            margin: 0 0 10px 0;
        }
        
        .documentation-path {
            opacity: 0.5;
        }
        
        .wrapper.hidden {
            display: none;
        }
        
        .empty-results {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            font-size: 20px;
            text-align: center;
            opacity: 0.5;
        }
        
        .empty-results.hidden {
            display: none;
        }
        
        .empty-results .icon {
            font-size: 50px;
        }
        
        </style>
        <div class="wrapper ${!this.show ? "hidden" : ""}">
            <div class="search-form">
                <button class="search-button" @click="${() => this.performSearch(this.search)}" ><bde-icon icon="mdi-magnify"></bde-icon></button>
                <input
                    type="text"
                    class="search-input"
                    placeholder="Chercher partout..."
                    .value="${this.search}"
                    @keyup="${e => this.search = e.target.value}"
                    @change="${e => this.search = e.target.value}"
                    id="input"/>
                ${this.search != "" ? html`<button class="search-button" @click="${() => this.clearField()}"><bde-icon icon="mdi-close"></bde-icon></button>` : ""}
            </div>
            <div class="search-box" @click="${() => this.attemptHide()}">
                <div class="search-tips">
                    <h3>Astuce</h3>
                    <p class="img-tip">
                        <img src="/static/img/maj-key.svg" alt="Touche MAJ"/>&nbsp;
                        <img src="/static/img/maj-key.svg" alt="Touche MAJ"/>
                    </p>
                    <p>Appuie deux fois sur MAJ pour ouvrir la recherche</p>
                </div>
                <div class="search-results ${this.search == "" ? "hidden" : ""}">
                    <div class="empty-results ${emptyResult ? "" : "hidden"}">
                        <div class="icon"><bde-icon icon="mdi-magnify"></bde-icon></div>
                        <p>Désolé... Aucun résultat</p>
                    </div>
                    ${quicklinkHtml.length > 0 ? html`<div class="row-results reduced-results">
                        ${quicklinkHtml}
                    </div>` : ""}
                    ${commissionsHtml.length > 0 ? html`<div class="row-results">
                        ${commissionsHtml}
                    </div>` : ""}
                    ${eventHtml.length > 0 ? html`<div class="row-results">
                        ${eventHtml}
                    </div>` : ""}
                    ${usersHtml.length > 0 ? html`<div class="row-results">
                        ${usersHtml}
                    </div>` : ""}
                    ${documentationHtml.length > 0 ? html`<div class="list-results">
                        ${documentationHtml}
                    </div>` : ""}
                </div>
            </div>
        </div>
        `
    }

}

customElements.define("bde-search-box", SearchBoxComponent)