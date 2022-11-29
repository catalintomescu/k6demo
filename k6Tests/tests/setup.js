import { GetBearerTokenFromOkta } from './common/GetBearerTokenFromOkta.js'
import { GetBearerTokenFromSwagger } from './common/GetBearerTokenFromSwagger.js'
import { EXECUTION_TYPE_LOCAL } from './common/constants.js';

export function TestsSetup(data) {
  // 2. setup code

  let token = "";

  if (data.ENVIRONMENT.execution === EXECUTION_TYPE_LOCAL) {
    token = GetBearerTokenFromSwagger(data.SETTINGS.tokenUrl);
  } else {
    const SECRETS = DATA.SECRETS_MANAGER.getSecrets();
    token = GetBearerTokenFromOkta(SECRETS.userName, SECRETS.userPassword, 
      SECRETS.client_id, SECRETS.client_secret, SECRETS.scope);
  }

  data.JWT_TOKEN = token;
	
  return data;
}
