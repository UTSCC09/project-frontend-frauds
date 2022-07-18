import axios from "axios";
import config from "../../config";

export async function addBooking(body) {
  return axios.post(`${config.BACKEND_URL}/api/bookings`, body);
}
