import axios from "axios";
import config from "../../config";

export async function searchByName(name) {
  return axios.get(`${config.BACKEND_URL}/airports`, { params: { name } });
}
