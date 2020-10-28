const boats = require('../models').boat;
const crudControllers = require('../utils/crud');

module.exports = {
  ...crudControllers(boats),
  create(req, res) {
    return boats
      .create({
        name: req.body.name.toLowerCase(),
        capacity: req.body.capacity,
        type: req.body.type.toLowerCase(),
        countryid: req.body.countryid,
      })
      .then((boat) => res.status(201).json({ data: boat }))
      .catch((error) => res.status(400).send(error));
  },
};
