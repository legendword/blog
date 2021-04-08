import axios from 'axios'

axios.defaults.withCredentials = true
const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'https://analycube.com:8001'
})

//const base = 'https://legendword.com/wordblog'

const api = {
    //get: (path, params) => axiosInstance.get(`${path}`, { params: params, headers: {'X-Client-Version': '0.2'} }),
    get: (path, params) => axiosInstance.get(`${path}`, { params: params }),
    post: (path, params) => axiosInstance.post(`${path}`, params),
    put: (path, params) => axiosInstance.put(`${path}`, params),
    delete: (path, params) => axiosInstance.delete(`${path}`, params)
}
export default api;