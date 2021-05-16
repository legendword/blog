import axios from 'axios'
import { Platform } from 'quasar'
import '@capacitor-community/http'
import { Plugins } from '@capacitor/core'

const baseURL = 'https://analycube.com:8001'

var api;
if (Platform.is.capacitor) {
    const { Http } = Plugins
    api = {
        get: (path, params) => Promise.resolve(Http.request({
            method: 'GET',
            url: baseURL + path,
            params
        })),
        post: (path, params) => Promise.resolve(Http.request({
            method: 'POST',
            url: baseURL + path,
            data: params
        })),
        put: (path, params) => Promise.resolve(Http.request({
            method: 'PUT',
            url: baseURL + path,
            data: params
        })),
        delete: (path, params) => Promise.resolve(Http.request({
            method: 'DELETE',
            url: baseURL + path,
            data: params
        }))
    }
}
else {
    axios.defaults.withCredentials = true
    const axiosInstance = axios.create({
        withCredentials: true,
        baseURL: baseURL
    })

    api = {
        //get: (path, params) => axiosInstance.get(`${path}`, { params: params, headers: {'X-Client-Version': '0.2'} }),
        get: (path, params) => axiosInstance.get(`${path}`, { params: params }),
        post: (path, params) => axiosInstance.post(`${path}`, params),
        put: (path, params) => axiosInstance.put(`${path}`, params),
        delete: (path, params) => axiosInstance.delete(`${path}`, params)
    }
}

export default api;