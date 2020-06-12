export class ApiError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response
    }
}

export class ApiClient {
    async apiCall(method, url, data){
        let initObj = {
            method: method,
            headers: {}
        }

        if(data){
            if(typeof data == "object" && !(data instanceof FormData)){
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

        if(!res.ok){
            throw new ApiError("Request failed", res)
        }

        return res
    }

    async createUpload(file){
        let formdata = new FormData()
        formdata.append('file',file, file.name)
        let response = await this.apiCall("POST","/api/uploads/", formdata)
        return await response.json()
    }

    async apiGET(url){
        return await this.apiCall("GET", url)
    }
}

export const apiClient = new ApiClient()
export default apiClient