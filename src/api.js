import axios from 'axios'

axios.defaults.withCredentials = true

//const base = 'https://legendword.com/wordblog'
const base = 'https://analycube.com:8001'
//const base = 'http://192.168.0.14/legendword_blog'

const api = {
    get: (path, params) => axios.get(`${base}${path}`, { params: params }),
    post: (path, params) => axios.post(`${base}${path}`, params),
    put: (path, params) => axios.put(`${base}${path}`, params),
    delete: (path, params) => axios.delete(`${base}${path}`, params)
}
export default api;