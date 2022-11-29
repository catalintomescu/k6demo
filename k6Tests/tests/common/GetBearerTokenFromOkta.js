import http from 'k6/http';
import encoding from 'k6/encoding';

export function GetBearerTokenFromOkta(username, password, client_id, client_sercret, scope) {
  
  const credentials = `${client_id}:${client_sercret}`;
  const encodedCredentials = encoding.b64encode(credentials);
  
  let params = {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=openid%20profile%20${scope}`;
  console.debug(`Calling Okta...`);
  
  let response = http.post("https://mydomain.oktapreview.com/oauth2/mydomainapi/v1/token", body, params);
  console.debug('Okta response', response.body);

  if (response.status == 200) {
    let res = JSON.parse(response.body);
    let token = `${res.token_type} ${res.access_token}`;
    
    return token;
    
  } else {
    // Handle Okta errors
  }
}
