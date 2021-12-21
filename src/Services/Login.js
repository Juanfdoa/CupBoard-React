import axios from "axios";

const url = 'https://localhost:44374/api/cuentas/login'

const login = async credentials =>{
    const {data} = await axios.post(url, credentials)
    return {data}
}

export default { login }