import axios from "axios";
import config from "../../config";

// subscribes to webhook event
export async function subscribe(body, flightId) {
  return axios.post(
    `${config.BACKEND_URL}/api/webhooks/flights/${flightId}`,
    body
  );
}

// unsubscribes from webhook event
export async function unsubscribe(body, flightId) {
  return axios.delete(
    `${config.BACKEND_URL}/api/webhooks/flights/${flightId}`,
    { data: body }
  );
}
