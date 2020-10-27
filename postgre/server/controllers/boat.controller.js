const boats = require('../models').boat;

module.exports = {
  create(req, res) {
    return boats
      .create({
        name: req.body.name,
        capacity: req.body.capacity,
        type: req.body.type,
        countryid: req.body.countryid,
      })
      .then((boat) => res.status(201).send(boat))
      .catch((error) => res.status(400).send(error));
  },
};
