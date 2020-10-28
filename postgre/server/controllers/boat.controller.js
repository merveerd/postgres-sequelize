var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

const boats = require('../models').boat;
const crudControllers = require('../utils/crud');
const { cacheRemover } = require('../utils/helper');

client.on('error', function (err) {
  console.log('Something went wrong ', err);
});

module.exports = {
  ...crudControllers(boats),
  create(req, res) {
    return boats
      .findOrCreate({
        where: {
          name: req.body.name.toLowerCase(),
        },
        defaults: {
          name: req.body.name.toLowerCase(),
          capacity: req.body.capacity,
          type: req.body.type.toLowerCase(),
          countryid: req.body.countryid,
        },
      })
      .then((result) => {
        cacheRemover(`boat-all`);

        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(error));
  },
};
