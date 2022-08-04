import axios from "axios";
import config from "../../config";
import { getAccessToken } from "./auth";

export async function addBooking(body) {
  const token = await getAccessToken();
  return axios.post(`${config.BACKEND_URL}/api/bookings`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getBooking() {
  const token = await getAccessToken();
  return axios.get(`${config.BACKEND_URL}/api/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function downloadBookingReceipt(id) {
  const token = await getAccessToken();
  return axios.get(`${config.BACKEND_URL}/api/bookings/` + id + "/receipt/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
