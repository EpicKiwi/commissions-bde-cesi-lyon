import {LitElement, html} from 'lit-element';
import "../../../index/assets/components/card";
import {DateConverter} from "../../../commissions/assets/utils/converters";

class EventCard extends LitElement {
    static get properties() {
        return {
            bannerSrc: {type: String},
            eventName: {type: String},
            eventStart: {converter: DateConverter},
            eventEnd: {converter: DateConverter}
        };
    }

    constructor() {
        super();
    }

    render() {
        let hour = `${('0' + this.eventStart.getHours()).slice(-2)}h`

        if(this.eventStart.getMinutes() > 0){
            hour += ('0' + this.eventStart.getMinutes()).slice(-2)
        }

        return html`
        <style>
    
    :host {
        display: block;
        width: 300px;
    }

    * {
        box-sizing: border-box;
    }

    .event {
        max-width: 100%;
        position: relative;
        padding: 10px;
        width: 100%;
        
        overflow: hidden;
    }

    .event > * {
        z-index: 1;
        position: relative;
    }

    .banner {
        width: 100%;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        z-index: 0;
    }
    
    :host(.big-banner) .banner {
        height: 200px;
    }

    .banner img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        transition: 0.5s ease transform;
    }

    .banner::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(17,11,11,0.6);
        z-index: 1;
    }

    .event:hover .banner img {
        transform: scale(1.05);
    }

    :host(.static) .event:hover .banner img {
        transform: scale(1);
    }
    
    .header {
        height: 80px;
        margin-bottom: 15px;

        display: flex;
        align-items: flex-end;
    }
    
    :host(.big-banner) .header {
        height: 180px;
    }

    .header .info {
        flex: 1;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .header .info > * {
        max-width: 100%;
    }

    .header .info .place {
        font-size: 20px;
        font-weight: bold;
        margin-top: 10px;
    }

    .header .info .relative-time {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .header .date {
        height: 80px;
        width: 80px;
        min-width: 80px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.6);
        margin-right: 10px;

        display: flex;
        flex-direction: column;

        overflow: hidden;
        text-align: center;

        backdrop-filter: blur(10px);
        -moz-backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .header .date .mounth {
        line-height: 25px;
        font-size: 16px;
        background: #ed4949;
        font-weight: bold;
        color: #f4d7d7;

    }

    .header .date .day {
        height: 30px;

        font-size: 30px;
        line-height: 33px;
        font-weight: 300;
    }

    .header .date .hour {
        line-height: 25px;
        font-size: 16px;

        background: rgba(0,0,0,0.05);
    }

    .name {
        font-family: var(--title-fonts);
        width: 100%;
        font-size: 23px;

        margin: 10px;

        margin: 0;
        height: 50px;
    }
    
    :host(.big-title) .name {
        font-size: 40px;
        height: 50px;
        padding: 10px 5vw;
    }

    .name .resizer {
        display: flex;
        flex-direction: column
        justify-content: flex-start;
        align-items: center;
    }
    
    .place-resizer {
        height: 30px;
    }

    </style>
        <bde-card class="event" static>
            <div class="banner"><img id="banner" src="${this.bannerSrc}"></div>
    
            <div class="header">
                <div class="date">
                    <div class="mounth" id="mounth">${EventCard.MOUNTHS[this.eventStart.getMonth()]}</div>
                    <div class="day" id="day">${this.eventStart.getDate()}</div>
                    <div class="hour" id="hour">${hour}</div>
                </div>
                <div class="info">
                    <div class="relative-time"><slot name="relative-time"></slot></div>
                    <div class="place" id="place"><bde-autoresize class="place-resizer"><slot name="location"></slot></bde-autoresize></div>
                </div>
            </div>
    
            <h3 class="name"><bde-autoresize id="name" class="resizer">${this.eventName}</bde-autoresize></h3>
    
            <div class="body">
                <slot name="body"></slot>
            </div>
    
            <div class="commission">
                <slot name="commission"></slot>
            </div>
        </bde-card>
        `;
    }
}

EventCard.MOUNTHS = [
    "JAN",
    "FEV",
    "MAR",
    "AVR",
    "MAI",
    "JUI",
    "JUL",
    "AOU",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
]

customElements.define('bde-event-card', EventCard);