import axios from "axios";
import config from "../../config";
import {getAccessToken} from "./auth";

export async function searchRoutes(query) {
  const token = await getAccessToken();
  return axios.post(`${config.BACKEND_URL}/api/routes/search`, {
    query,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
