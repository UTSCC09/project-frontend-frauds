import axios from "axios";
import config from "../../config";
import { getAccessToken } from "./auth";

// add flight
export async function addFlight(body) {
  const token = await getAccessToken();
  return axios.post(`${config.BACKEND_URL}/api/flights`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// find oneway flights
export async function findOneWayFlights(
  sourceAirport,
  destAirport,
  departureDate,
  page = 0,
  limit = 5
) {
  const token = await getAccessToken();
  return axios.get(`${config.BACKEND_URL}/api/flights/oneway`, {
    params: {
      sourceAirport,
      destAirport,
      departureDate,
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
