import axios from "axios";
import config from "../../config";
import {getAccessToken} from "./auth";

// subscribes to webhook event
export async function subscribe(body, flightId) {
  const token = await getAccessToken();
  return axios.post(
    `${config.BACKEND_URL}/api/webhooks/flights/${flightId}`,
    body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// unsubscribes from webhook event
export async function unsubscribe(body, flightId) {
  const token = await getAccessToken();
  return axios.delete(
    `${config.BACKEND_URL}/api/webhooks/flights/${flightId}`,
    { data: body , headers: {Authorization: `Bearer ${token}`}}
  );
}
