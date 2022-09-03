// const fetch = require('node-fetch');
const axios = require('axios');
// const cheerio = require('cheerio');

const URL = 'https://directory.goodonyou.eco/brand';

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// const getRawData = (website) => {
//   return fetch(`URL/${'zara'}`)
//     .then((response) => response.text())
//     .then((data) => {
//       return data;
//     });
// };

export const getBrandData = (website) => {
  axios
    .get(`URL/${'zara'}`)
    .then((res) => {
      const parsedData = cheerio.load(res.data);
      console.log(parsedData);
    })
    .catch((err) => console.error(err));
};
