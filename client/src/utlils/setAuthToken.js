import axios from "axios";

const setAuthToken = () => {
  // Configure axios to send credentials with every request
  axios.defaults.withCredentials = true;
};

export default setAuthToken;