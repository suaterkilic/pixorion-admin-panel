import Base from "../Base";

export default {
  sendRequest: async (params) => {
    let result;

    try {
      let base = await Base.api(params);
      if (base.status === 200) {
        result = base;
      }
    } catch (error) {
        result = error;
    }

    return result;
  },

};
