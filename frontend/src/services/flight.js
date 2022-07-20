import axios from "axios";
import config from "../../config";

export async function addFlight(body) {
  return axios.post(`${config.BACKEND_URL}/api/flights`, body);
}

export async function findOneWayFlights(
  sourceAirport,
  destAirport,
  departureDate,
  page = 0,
  limit = 5
) {
  return axios.get(`${config.BACKEND_URL}/api/flights/oneway`, {
    params: { sourceAirport, destAirport, departureDate, page, limit },
  });
}
