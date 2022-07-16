import axios from "axios";
import config from "../../config";

export async function searchPlanes(query) {
  return axios.post(`${config.BACKEND_URL}/api/planes/search`, {
    query,
    fields: ["name", "iata"],
  });
}

