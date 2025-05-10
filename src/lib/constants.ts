// Regex for validating Xtream Codes API URL (http://host:port) - This is for the BASE URL.
// The action /player_api.php or /panel_api.php will be appended by the service.
export const XTREAM_CODES_URL_REGEX = /^http:\/\/[a-zA-Z0-9.-]+:\d+$/;

// Regex for validating M3U/M3U8 URL. Made more permissive to accept URLs with query parameters like get.php?....
export const M3U_URL_REGEX = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/[\w.-]*)*(\?.*)?$/i;
