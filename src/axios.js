import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://test-date-booking-app-dummy.firebaseio.com/'
})

export default instance