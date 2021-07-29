import axios from 'axios'
import { API } from './url'


const axiosInstance = axios.create({
    baseURL: API
})

export default axiosInstance

export const getDataApi = async (url, token) => {
    const res = await axios.get(`${API}/${url}`, {
        headers: {
            Authorization: token
        }
    })
    return res
}

export const postDataApi = async (url, post, token) => {
    const res = await axios.post(`${API}/${url}`, post, {
        headers: {
            Authorization: token
        }
    })
    return res
}


export const putDataApi = async (url, put, token) => {
    const res = await axios.put(`${API}/${url}`, put, {
        headers: {
            Authorization: token
        }
    })
    return res
}

export const patchDataApi = async (url, put, token) => {
    const res = await axios.patch(`${API}/${url}`, put, {
        headers: {
            Authorization: token
        }
    })
    return res
}

export const deleteDataApi = async (url, token) => {
    const res = await axios.delete(`${API}/${url}`, {
        headers: {
            Authorization: token
        }
    })
    return res
}