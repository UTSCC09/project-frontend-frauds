import config from "../../config";
import axios from "axios";
import {getAccessToken} from "./auth";

export async function getUserInfo() {
  const token = await getAccessToken();
  const result = await axios.post(`${config.BACKEND_URL}/api/user/search`, {"email":"lingfengsu0309@gmail.com"},{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return result.data;
}