import config from "../../config";
import axios from "axios";
import { getAccessToken } from "./auth";

export async function getUserInfo(email) {
  const token = await getAccessToken();
  const result = await axios.post(
    `${config.BACKEND_URL}/api/users/search`,
    { email: email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}

export async function upgradeUser(email) {
  const token = await getAccessToken();
  const result = await axios.patch(
    `${config.BACKEND_URL}/api/users/`,
    { email, role: ["user", "admin"] },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}
