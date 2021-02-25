import axios from 'axios'

axios.defaults.withCredentials = true

const base = 'http://localhost/legendword_blog'

export const signUp = params => axios.post(`${base}/backend/signup.php`, JSON.stringify(params));
export const signIn = params => axios.post(`${base}/backend/signin.php`, JSON.stringify(params));
export const signOut = params => axios.post(`${base}/backend/signout.php`, JSON.stringify(params));
export const userInfo = params => axios.post(`${base}/backend/userinfo.php`, JSON.stringify(params));