//url相关
//const BASE_URL = "https://hjaustralia.com";
const BASE_URL = "http://localhost:8080"

//登录
const DEPARTURE_URL = BASE_URL + "/api/ptv/departures/";
const STOP_URL = BASE_URL + "/api/ptv/patterns/";

const HEADERS = {
  'content-type': 'application/json',
  'Authorization': 'Basic ZDY4MDA1NDppcXdLODI0IWMxMlI='
};


module.exports = {
  BASE_URL: BASE_URL,
  DEPARTURE_URL: DEPARTURE_URL,
	STOP_URL: STOP_URL,
  HEADERS: HEADERS,
}
