var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

const crudControllers = require('../utils/crud');
const countries = require('../models').country;
const { cacheRemover } = require('../utils/helper');

client.on('error', function (err) {
  console.log('Something went wrong ', err);
});

module.exports = {
  ...crudControllers(countries),
  create(req, res) {
    return countries
      .findOrCreate({
        where: {
          name: req.body.name.toLowerCase(),
        },
        defaults: {
          name: req.body.name.toLowerCase(),
        },
      })
      .then((result) => {
        cacheRemover(`country-all`);

        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(error));
  },
};
