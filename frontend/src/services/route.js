import axios from "axios";
import config from "../../config";

export async function searchRoutes(query) {
  return axios.post(`${config.BACKEND_URL}/api/routes/search`, {
    query,
  });
}
