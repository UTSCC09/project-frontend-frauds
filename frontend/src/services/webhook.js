import axios from "axios";
import config from "../../config";

export async function subscribe(body, flightId) {
  return axios.post(
    `${config.BACKEND_URL}/api/webhooks/flights/${flightId}`,
    body
  );
}

export async function unsubscribe(body, flightId) {
  return axios.delete(
    `${config.BACKEND_URL}/api/webhooks/flights/${flightId}`,
    { data: body }
  );
}
