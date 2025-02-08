import axios from 'axios'

// axios interceptor 생성
const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BACK_URL,
    timeout: 10000,
    withCredentials: true
})

export default axiosInstance