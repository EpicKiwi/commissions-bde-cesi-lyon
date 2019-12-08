require('dotenv').config()

const path = require('path');
const glob = require("glob");
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const entries = glob.sync("src/*/assets/bundles/*.js", {nodir: true})
    .map(path => path.replace(/^src\//, "./"))
    .reduce((obj, realpath) => {
        let newobj = {...obj}
        let buildpath = path.basename(realpath, path.extname(realpath))
        newobj[buildpath] = realpath
        return newobj
    }, {})

console.log("Detected bundle files : ")
for(let name in entries){
    console.log(" - ", name, ":", entries[name])
}

module.exports = {
    context: path.join(__dirname, "src"),
    entry: entries,
    output: {
        path: path.resolve('src/built-assets/bundles'),
        filename: "[name]-[hash].js"
    },

    plugins: [
        new BundleTracker({filename: './src/webpack-stats.json'}),
        new CleanWebpackPlugin()
    ],


    mode: process.env.ENVIRONMENT == "development" ? "development" : "production",
    devtool: process.env.ENVIRONMENT == "development" ? "eval-source-map" : "source-map",
    optimization: {
        minimize: process.env.ENVIRONMENT != "development",
        splitChunks: {
            chunks: "all"
        }
    }
}
