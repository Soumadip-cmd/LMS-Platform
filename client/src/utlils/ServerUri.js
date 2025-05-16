/**
 * Central configuration file for API endpoints
 * This makes it easier to change the server URL across the entire application
 *
 * Usage:
 * import { SERVER_URI } from '../utlils/ServerUri';
 *
 * axios.defaults.baseURL = SERVER_URI;
 * // or
 * const response = await axios.get(`${SERVER_URI}/endpoint`);
 */

export const SERVER_URI = "http://localhost:8000/api/v1";