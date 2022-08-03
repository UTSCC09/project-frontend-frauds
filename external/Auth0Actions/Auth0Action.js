const axios = require("axios");
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  if (event.authorization) {
    api.accessToken.setCustomClaim(`email`, event.user.email);
  }
  if (event.stats.logins_count > 1 || event.request.query.prompt === "none") {
    return;
  }
  try {
    const tokenOptions = {
      method: "POST",
      url: `https://${event.secrets.DOMAIN}/oauth/token`,
      headers: { "content-type": "application/json" },
      data: {
        grant_type: "client_credentials",
        client_id: event.secrets.CLIENT_ID,
        client_secret: event.secrets.CLIENT_SECRET,
        audience: `${event.secrets.AUDIENCE}`,
      },
    };
    const res = await axios.request(tokenOptions);
    console.log("Access Token: ", res.data.access_token);

    try {
      const response = await axios.post(
        `${event.secrets.backendUrl}/api/users/`,
        {
          email: event.user.email,
          name: {
            firstName: event.user.given_name,
            middleName: "",
            lastName: event.user.family_name,
          },
          role: ["user"],
        },
        {
          headers: {
            Authorization: `Bearer ${res.data.access_token}`,
            "content-type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
      if (e.response.status === 404) {
        api.access.deny("Could not reach API");
      }
      if (e.response.status === 500) {
        api.access.deny("Could not create user doc");
      }
      api.access.deny("Something went wrong when contacting API");
      return;
    }
  } catch (e) {
    api.access.deny("Failed to get access token");
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
