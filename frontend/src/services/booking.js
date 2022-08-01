import axios from "axios";
import config from "../../config";
import {getAccessToken} from "./auth";

export async function addBooking(body) {
  const token = await getAccessToken();
  return axios.post(`${config.BACKEND_URL}/api/bookings`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
