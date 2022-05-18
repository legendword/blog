import axios from "axios";
import store from "src/store";

const baseURL = "https://analycube.com:8001"; //8002 dev, 8001 prod

var api;
axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

api = {
    //get: (path, params) => axiosInstance.get(`${path}`, { params: params, headers: {"X-Client-Version": "0.2"} }),
    instance: axiosInstance,
    get: (path, params) => axiosInstance.get(`${path}`, {
        params: params,
        headers: {
            "Authorization": store.state.authorization
        }
    }),
    post: (path, params) => axiosInstance.post(`${path}`, params, {
        headers: {
            "Authorization": store.state.authorization
        }
    }),
    put: (path, params) => axiosInstance.put(`${path}`, params, {
        headers: {
            "Authorization": store.state.authorization
        }
    }),
    delete: (path, params) => axiosInstance.delete(`${path}`, {
        params: params,
        headers: {
            "Authorization": store.state.authorization
        }
    })
};
// }

export default api;