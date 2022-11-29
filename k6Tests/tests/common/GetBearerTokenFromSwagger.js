import http from 'k6/http';
import encoding from 'k6/encoding';

export function GetBearerTokenFromSwagger(tokenUrl) {
  
  let params = {
    headers: {
      'Accept': '*/*',
    },
  };

  let response = http.get(tokenUrl, params);
  console.debug('Swagger response', response.body);

  if (response.status == 200) {
    let token = response.body;
    
    return `Bearer ${token}`;
    
  } else {
    // Handle API errors
  }
}
