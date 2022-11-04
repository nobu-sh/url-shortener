import Axios from 'axios'
import { getStoredToken } from '../state'

export const Request = Axios.create({
  baseURL: '/api',
  headers: getStoredToken() ? {
    authorization: `Bearer ${getStoredToken()}`,
  } : {},
})
