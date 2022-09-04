// const fetch = require('node-fetch');
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'http://directory.goodonyou.eco/brand';

const brandData = {
  zara: {
    rating: 2,
    planet: 2,
    people: 2,
    animals: 2,
    url: `${URL}/zara`,
    description:
      'Zara is not taking adequate steps to ensure payment of a living wage for its workers.',
  },
  amazon: {
    rating: 2,
    planet: 2,
    people: 2,
    animals: 2,
    url: `${URL}/amazon`,
    description:
      'Amazon is not taking adequate steps to ensure payment of a living wage for its workers.',
  },
  uniqlo: {
    rating: 3,
    planet: 2,
    people: 2,
    animals: 3,
    url: `${URL}/uniqlo`,
    description:
      'Uniqlo has good policies to audit suppliers in its supply chain but is not taking adequate steps to ensure payment of a living wage for its workers.',
  },
  everlane: {
    rating: 2,
    planet: 2,
    people: 2,
    animals: 2,
    url: `${URL}/everlane`,
    description:
      'Everlane is not taking adequate steps to ensure payment of a living wage for its workers.',
  },
  shein: {
    rating: 1,
    planet: 1,
    people: 1,
    animals: 1,
    url: `${URL}/shein`,
    description: 'SHEIN is not taking adequate steps to manage its greenhouse gas emissions.',
  },
  etiko: {
    rating: 5,
    planet: 5,
    people: 5,
    animals: 5,
    url: `${URL}/etiko`,
    description:
      'Etiko is an Australian footwear label that offers eco-friendly, organic clothing and shoes.',
  },
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getBrandData = (website) => {
  return brandData[website];
  // axios
  //   .get(`${URL}/${'zara'}`)
  //   .then((res) => {
  //     const parsedData = cheerio.load(res.data);
  //     console.log(parsedData);
  //   })
  //   .catch((err) => console.error(err));
};
