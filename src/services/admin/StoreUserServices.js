import Base from "../Base";

export default {
  store_admin: async (params) => {
    let result;
    try {
      let base = await Base.api(params);

      if (base.status === 200) {
        result = base;
      }else if(base.status === 401){
        result = base;
      }
    } catch (error) {
      result = error;
    }

    return result;
  }

};
