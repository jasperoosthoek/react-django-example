import axios from './Axios';
import { toast } from 'react-toastify';

export const setAxiosAuthToken = token => {
  if (typeof token !== 'undefined' && token) {
    // Apply for every request
    axios.defaults.headers.common['Authorization'] = 'Token ' + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const toastOnError = error => {
  if (error.response) {
    if (error.response.data.detail) {
      // Django Api exception
      toast.error(error.response.data.detail);
    } else {
      toast.error(JSON.stringify(error.response.data));
    }
  } else if (error.message) {
    toast.error(JSON.stringify(error.message));
  } else {
    toast.error(JSON.stringify(error));
  }
};

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);


export const getTimestamp = () => Math.round(new Date().getTime()/1000);

export const snakeToCamelCase = str => str.replace(
  /([-_][a-z])/g,
  (group) => group
    .replace('-', '')
    .replace('_', '')
);

export const camelToSnakeCase = str => (str
    .split(/(?=[A-Z])/)
    .map(x => x.toUpperCase())
    .join('_')
);

export const pluralToSingle = str => {
  if (str.slice(-1) !== 's') {
    // This string is not plural: keep it unaltered
    return str;
  } else if (str.slice(-3) === 'ies') {
    // Handle special case of categories
    return `${str.slice(0, -3)}y`;
  } else if (str.slice(-3) === 'IES') {
    // Same but in upper case
    return `${str.slice(0, -3)}Y`;
  } else {
    // Standard plural
    return str.slice(0, -1);
  } 
}

export const arrayToObject = (array, byKey) => Object.fromEntries(array.map(obj => [obj[byKey], obj]));

export const roundFixed = (str, decimals) => parseFloat(str).toFixed(decimals);
export const round = (str, decimals) => parseFloat(parseFloat(str).toFixed(decimals));