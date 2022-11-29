import http from 'k6/http';
import { check, sleep, group } from 'k6';

export let WeatherForecastTests = [
  AllWeatherForecast
];

var REQUEST_HEADERS = null;

function requestHeaders (data) {
  if (!REQUEST_HEADERS) {
    REQUEST_HEADERS = {
      'User-Agent': 'k6',
      Authorization: data.JWT_TOKEN,
    };
  }

  return REQUEST_HEADERS;
}

function AllWeatherForecast (data) {
  // 3. VU code

    group('Weather Forecast', function () {
      let res = http.get(`${data.SETTINGS.baseUrl}/WeatherForecast`, { headers: requestHeaders(data) });
      console.debug('API response', res.body);

    // Expected Result
    // [
    //   {
    //     "$id": "1",
    //     "Date": "",
    //     "TemperatureC": "",
    //     "TemperatureF": "",
    //     "Summary": ""
    //   },
    //   ...
    // ]

    check(res, { 'status was 200': (r) => r.status == 200 });

    let response = JSON.parse(res.body);
    check(res, { 'all weather forecast found': (r) => response.length > 0 });
  });
}
