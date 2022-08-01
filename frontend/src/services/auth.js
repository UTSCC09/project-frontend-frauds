import {createAuth0} from "@auth0/auth0-vue";
import config from "../../config";

/*
 * We declare our auth0 initialization here to allow for usage of auth0 functions outside of components.
 */
export const auth0 = createAuth0({
  domain: config.DOMAIN,
  client_id: config.CLIENT_ID,
  redirect_uri: window.location.origin,
  audience: config.AUDIENCE,
});

export async function getAccessToken(){
  return await auth0.getAccessTokenSilently();
}