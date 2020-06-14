export default {title: "Flushing Inputs"}

import "@index/components/flushing-checkbox"

export const checkbox = () => `

<p>
	<bde-flushing-checkbox
		verb="PATCH"
		src="https://httpbin.org/anything"
		requestPath="pomme"
		responsePath="json.pomme"
	>
		<input type="checkbox" id="pomme"/>
	</bde-flushing-checkbox>
	<label for="pomme">Pomme normal</label>
</p>
<p>
	<bde-flushing-checkbox
		verb="POST"
		src="https://httpbin.org/delay/2"
		requestPath="Poire"
		responsePath="json.poire"
	>
		<input type="checkbox" id="poire"/>
	</bde-flushing-checkbox>
	<label for="poire">Poire avec délai</label>
</p>
<p>
	<bde-flushing-checkbox
		verb="PATCH"
		src="https://httpbin.org/anything"
		requestPath="pomme"
		responsePath="json.pomme"
	>
		<input type="checkbox" id="raisin"/>
	</bde-flushing-checkbox>
	<label for="raisin">Raisin PATCH</label>
</p>
<p>
	<bde-flushing-checkbox
		src="https://httpbin.org/status/500"
		responsePath="json.kiwi"
	>
		<input type="checkbox" id="kiwi"/>
	</bde-flushing-checkbox>
	<label for="kiwi">Kiwi error</label>
</p>
`