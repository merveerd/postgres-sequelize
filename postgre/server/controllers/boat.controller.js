const boats = require('../models').boat;
const crudControllers = require('../utils/crud');

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
      .then((result) =>
        res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` })
      )
      .catch((error) => res.status(400).send(error));
  },
};
