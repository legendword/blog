import axios from 'axios'

axios.defaults.withCredentials = true

const base = 'https://legendword.com/wordblog'
//const base = 'http://localhost/legendword_blog'
//const base = 'http://192.168.0.14/legendword_blog'

const api = (name, params) => axios.post(`${base}/backend/${name}.php`, JSON.stringify(params));
export default api;