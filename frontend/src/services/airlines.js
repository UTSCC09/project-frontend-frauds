import axios from "axios";
import config from "../../config";

export async function search(query) {
  return axios.post(`${config.BACKEND_URL}/api/airports/search`, {
    query,
    fields: ["name", "iata"],
  });
}
