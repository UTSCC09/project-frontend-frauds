import axios from "axios";
import config from "../../config";

export async function searchAirlines(query) {
  return axios.post(`${config.BACKEND_URL}/api/airlines/search`, {
    query,
    fields: ["name", "iata"],
    include: ["name", "iata"],
  });
}
