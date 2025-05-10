// Regex for validating Xtream Codes API URL (http(s)://host:port)
// Requires http or https, a hostname, and a port.
export const XTREAM_CODES_URL_REGEX = /^(https?:\/\/)([a-zA-Z0-9.-]+)(:\d+)$/;

// Regex for validating M3U/M3U8 URL.
// Allows various domain structures, optional ports, paths, and query parameters.
export const M3U_URL_REGEX = /^(https?:\/\/)([\w.-]+|\[[0-9a-fA-F:]+\])(:\d+)?(\/[\w.-]*)*(\?.*)?$/i;
