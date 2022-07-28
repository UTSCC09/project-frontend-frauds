import axios from "axios";
import config from "../../config";

export async function searchAirports(query) {
  return axios.post(`${config.BACKEND_URL}/api/airports/search`, {
    query,
    exclude: [
      "dst",
      "altitude",
      "icao",
      "latitude",
      "longitude",
      "source",
      "timezone",
      "type",
      "tzDatabaseTimeZone",
      "airportId",
    ],
  });
}
