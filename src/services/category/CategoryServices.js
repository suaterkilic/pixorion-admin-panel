import Base from "../Base";

export default {
  mainCreate: async (params) => {
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

  mainList: async (params) => {
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
  mainFetch: async (params) => {
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
  mainDelete: async (params) => {
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
  mainUpdate: async (params) => {
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
  mainPutPicture: async (params) => {
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

  subGet: async (params) => {
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
  subCreate: async (params) => {
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
  subInfo: async (params) => {
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
  subDelete: async (params) => {
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
