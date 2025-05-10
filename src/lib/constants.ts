// Regex for validating Xtream Codes API URL (http://host:port)
export const XTREAM_CODES_URL_REGEX = /^http:\/\/[a-zA-Z0-9.-]+:\d+$/;

// Regex for validating M3U/M3U8 URL
export const M3U_URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?.*)?$/i;
