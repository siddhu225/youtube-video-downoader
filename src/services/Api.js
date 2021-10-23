import axios from 'axios';
import _ from 'lodash';

const logAllRequests = false;

function baseConfig() {
  return {
    baseURL: `http://localhost:8081`,
    timeout: 30000,
  };
}

const Resource = function Resource(options) {
  console.log('options', options);
  const baseInstance = axios.create(_.extend(baseConfig(), options));
  baseInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  }, (error) => {
    if (logAllRequests) {
      console.log('request error');
      console.log(error);
    }

    return Promise.reject(error);
  });

  baseInstance.interceptors.response.use(
    (response) => {
      if (logAllRequests) {
        console.log('response normal');
        console.log(response);
      }
      return response;
    },
    (error) => {
      if (logAllRequests) {
        console.log('response error');
        console.log(error);
      }
      return Promise.reject(error.response || error);
    },
  );
  if (this instanceof Resource) {
    this.baseInstance = baseInstance;
    return this;
  }
  return baseInstance;
};

export default Resource;