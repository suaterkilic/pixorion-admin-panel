import axios from "axios";

export default {
  api: async (params) => {
    try {

      const headers = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      };

      let API_URL = "";

      API_URL = "https://pixorion.tattooandlife.com/" + params.url;
      
      if(params.url === 'admin/login'){
        return await axios.post(API_URL, params.data, headers);
      }else{
        if(localStorage.getItem('session_state') !== ''){
          params.data.jwt = JSON.parse(localStorage.getItem('session_state')).jwt;
          return await axios.post(API_URL, params.data, headers);
        }
      }
    } catch (error) {
      return error;
    }
  },
};
