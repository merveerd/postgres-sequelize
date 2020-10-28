const boats = require('../models').boat;
const crudControllers = require('../utils/crud');

var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

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
        client.del(`boat-all`, function (err, response) {
          if (response == 1) {
            console.log('Deleted Successfully!');
          } else {
            console.log('Cannot delete', response, err);
          }
        });

        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(error));
  },
};
