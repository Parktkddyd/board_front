import axios from 'axios'
import router from '@/router/router'

// axios interceptor 생성
const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BACK_URL,
    timeout: 10000
})


// Response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const { response } = error

        // Handle network errors
        if (!response) {
            router.push({
                name: 'Error',
                params: {
                    statusCode: 0,
                    message: '네트워크 에러입니다. 인터넷 연결을 확인해 주세요'
                }
            })
            return Promise.reject(error)
        }


        // Handle rate limiting
        if (response.status === 429) {
            const retryAfter = response.headers['retry-after']
            const message = retryAfter
                ? `요청이 너무 많습니다.  ${retryAfter} 초 뒤에 다시 시도해 주세요`
                : '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요'

            router.push({
                name: 'Error',
                params: {
                    statusCode: 429,
                    message
                }
            })
            return Promise.reject(error)
        }

        // Handle other errors
        if (response.status !== 200) {
            router.push({
                name: 'Error',
                params: {
                    statusCode: response.data.status,
                    message: response.data?.message
                }
            })
        }

        return Promise.reject(error)
    }
)

export default axiosInstance