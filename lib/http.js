import axios from 'axios'
export default axios.create({
    baseURL: 'https://openredu.ufpe.br/api',
})