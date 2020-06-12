export default {title: "Icon"}

import "@index/components/icon"

export const size = () => `
	<bde-icon icon="mdi-magnify"></bde-icon>
	<bde-icon icon="mdi-magnify" style="font-size: 25px" ></bde-icon>
	<bde-icon icon="mdi-magnify" style="font-size: 50px" ></bde-icon>
	<bde-icon icon="mdi-magnify" style="font-size: 75px" ></bde-icon>
	<bde-icon icon="mdi-magnify" style="font-size: 100px" ></bde-icon>
`

export const color = () => `
	<style>* { font-size: 50px; } </style>

	<bde-icon icon="mdi-magnify"></bde-icon>
	<bde-icon icon="mdi-magnify" style="color: #e8a004" ></bde-icon>
	<bde-icon icon="mdi-magnify" style="color: #bee804" ></bde-icon>
	<bde-icon icon="mdi-magnify" style="color: #e82e04" ></bde-icon>
	<bde-icon icon="mdi-magnify" style="color: #04bee8" ></bde-icon>
`

export const sources = () => `
	<style>* { font-size: 25px; padding: 0; margin: 0; } body {padding: 25px;} p {margin-bottom: 25px} </style>

	<h2>Material design</h2>
	<p>
		<bde-icon icon="mdi-magnify"></bde-icon>
		<bde-icon icon="mdi-close"></bde-icon>
		<bde-icon icon="mdi-baguette"></bde-icon>
		<bde-icon icon="mdi-check"></bde-icon>
		<bde-icon icon="mdi-coffee"></bde-icon>
	</p>

	<h2>Firefox OS Emojis</h2>
	<p>
		<bde-icon icon="fxemoji:alien"></bde-icon>
		<bde-icon icon="fxemoji:blackhardshellfloppy"></bde-icon>
		<bde-icon icon="fxemoji:bolt"></bde-icon>
		<bde-icon icon="fxemoji:circledideographcongratulation"></bde-icon>
		<bde-icon icon="fxemoji:foxwry"></bde-icon>
	</p>

	<h2>Logos</h2>
	<p>
		<bde-icon icon="logos:django"></bde-icon>
		<bde-icon icon="logos:javascript"></bde-icon>
		<bde-icon icon="logos:firefox"></bde-icon>
		<bde-icon icon="logos:archlinux"></bde-icon>
		<bde-icon icon="logos:css-3"></bde-icon>
	</p>

	<a href="https://iconify.design/icon-sets/">More icons <bde-icon icon="mdi-arrow-right"></bde-icon></a>
`