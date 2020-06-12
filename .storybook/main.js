const path = require('path');
const glob = require("glob");

module.exports = {
	stories: ['./stories/**/*.stories.js'],
	addons: ['@storybook/addon-storysource'],
	webpackFinal: (config) => {
		const apps = glob.sync("src/*")
			.reduce((obj, pth) => {
		    	let newobj = {...obj}
		    	let appname = path.basename(pth)
		    	newobj["@"+appname] = path.resolve(__dirname, path.join("..",pth,"assets/"))
		    	return newobj
			}, {})

		if(Object.values(apps).length > 0){
			console.log("Detected apps : ")
			for(let name in apps){
				let appPath = path.relative(path.join(__dirname,".."), apps[name])
				console.log(" - ", name, ":", appPath)
			}
		} else {
			console.log("No app detected")
		}

		config.resolve.alias = {
			...apps,
			...config.resolve.alias
		}

		return config;
	}
};