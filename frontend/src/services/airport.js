import axios from "axios";
import config from "../../config";
import { getAccessToken } from "./auth";

export async function searchAirports(query) {
  const token = await getAccessToken();
  return axios.post(
    `${config.BACKEND_URL}/api/airports/search`,
    {
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
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
