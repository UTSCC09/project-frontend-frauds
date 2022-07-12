import axios from "axios";
import config from "../../config";

export async function addFlight(body) {
  return axios.post(`${config.BACKEND_URL}/api/flights/flight`, body);
}
