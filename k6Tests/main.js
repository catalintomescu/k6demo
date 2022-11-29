import { sleep } from 'k6';
import { EXECUTION_TYPE_LOCAL, OPTIONS_SET_LOAD } from './tests/common/constants.js';

// #region PARSE __ENV
let ENVIRONMENT = {};
// Parse environment variables
// Default to local execution
ENVIRONMENT.execution = EXECUTION_TYPE_LOCAL;
if (__ENV.EXECUTION) {
  ENVIRONMENT.execution = __ENV.EXECUTION;
}

// Use default options
ENVIRONMENT.optionsSet = OPTIONS_SET_LOAD;
if  (__ENV.OPTIONS_SET) {
  ENVIRONMENT.optionsSet = __ENV.OPTIONS_SET;
}
// #endregion

// #region LOAD TESTS
// Import tests
import { WeatherForecastTests } from './tests/get-WeatherForecast.js';
import { TestsSetup } from './tests/setup.js';

let TESTS = [...WeatherForecastTests ];
// #endregion

// #region k6 OPTIONS
// Load k6 Run Options
let optionsFile = `./env/${ENVIRONMENT.execution}/config.${ENVIRONMENT.optionsSet}.json`;
console.debug(`Loading k6 options from ${optionsFile}`);
export let options = JSON.parse(open(optionsFile));
// #endregion

// #region DATA for TESTS/ENV
// Load test settings
import { SecretsManager } from './tests/common/secretsManager.js';
let DATA = JSON.parse(open(`./env/${ENVIRONMENT.execution}/settings.json`));
let SECRETS = {};
try {
  SECRETS = JSON.parse(open(`./env/${ENVIRONMENT.execution}/secrets.json`));
} catch (err) { }

if (__ENV.USER_NAME) {
  SECRETS.userName = __ENV.USER_NAME;
}
if (__ENV.USER_PASSWORD) {
  SECRETS.userPassword = __ENV.USER_PASSWORD;
}
if (__ENV.CLIENT_ID) {
  SECRETS.client_id = __ENV.CLIENT_ID;
}
if (__ENV.CLIENT_SECRET) {
  SECRETS.client_secret = __ENV.CLIENT_SECRET;
}
if (__ENV.SCOPE) {
  SECRETS.scope = __ENV.SCOPE;
}

DATA.SECRETS_MANAGER = new SecretsManager(SECRETS);
DATA.ENVIRONMENT = ENVIRONMENT;
// #endregion

// #region FILTER TESTS
// Filter the tests to run
let TESTS_TO_RUN = [];

if (__ENV.TEST_FILTERS) {
  DATA.TEST_FILTERS.enabled = true;

  let tokens = __ENV.TEST_FILTERS.split('|');
  DATA.TEST_FILTERS[tokens[0]] = tokens[1];
}

if (DATA.TEST_FILTERS.enabled) {
  TESTS_TO_RUN = TESTS.filter(t => {
    
    console.debug(`Test filters. Probing ${t.name}`);

    // starts with
    if (DATA.TEST_FILTERS.startsWith != null && 
      t.name.startsWith(DATA.TEST_FILTERS.startsWith))
      return true;

    // ends with
    if (DATA.TEST_FILTERS.endsWith != null && 
      t.name.endsWith(DATA.TEST_FILTERS.endsWith))
      return true;

    // contains
    if (DATA.TEST_FILTERS.contains != null && 
      t.name.indexOf(DATA.TEST_FILTERS.contains) != -1)
      return true;

    // regex
    if (DATA.TEST_FILTERS.regex != null &&
       t.name.match(DATA.TEST_FILTERS.regex))
      return true;

    return false;
  });
} else {
  TESTS_TO_RUN = [ ...TESTS ];
}
// #endregion

export function setup() {
  // 2. setup code

  TestsSetup(DATA);

  return DATA;
}

export default function (data) {
  // 3. VU code

  TESTS_TO_RUN.forEach(t => t(data));

  sleep(1);
}

export function teardown(data) {
  // 4. teardown code
}

// export function handleSummary(data) {
//   return { 'raw-data.json': JSON.stringify(data)};
// }
