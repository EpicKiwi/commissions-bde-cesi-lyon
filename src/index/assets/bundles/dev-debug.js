/**
 * @deprecated DEV function, ne pas utiliser en production
 */
async function apiCall(method, url, data){
    let initObj = {
        method: method,
        headers: {}
    }

    if(data){
        if(typeof data == "object"){
            initObj.body = JSON.stringify(data)
            initObj.headers["Content-Type"] = "application/json"
        } else {
            initObj.body = data
        }
    }

    if(method !== "GET"){
        let cookies = document.cookie.split("; ").reduce((acc,el) => {
            let cky = el.split("=")
            return {...acc, [cky[0]]: cky[1]}
        }, {})

        if(cookies.csrftoken){
            initObj.headers["X-CSRFToken"] = cookies.csrftoken
        }
    }

    let res = await fetch(url, initObj)
    let result = null

    if(res.ok){
        try{
            result = await res.json()
        } catch(e) {
            console.warn("Cannot parse data as JSON")
            result = res.body
        }
    } else {
        console.error("Request is not OK")
        console.log(res)
        return null
    }

    return result
}

/**
 * Effectue une opération de récupération
 * @deprecated DEV function, ne pas utiliser en production
 */
async function apiGET(url){
    return await apiCall("GET", url)
}

/**
 * Effectue une opération de création
 * @deprecated DEV function, ne pas utiliser en production
 */
async function apiPOST(url, data){
    return await apiCall("POST", url, data)
}

/**
 * Effectue une opération de mise à jour partielle
 * @deprecated DEV function, ne pas utiliser en production
 */
async function apiPATCH(url, data){
    return await apiCall("PATCH", url, data)
}

window.apiCall = apiCall
window.apiGET = apiGET
window.apiPOST = apiPOST
window.apiPATCH = apiPATCH