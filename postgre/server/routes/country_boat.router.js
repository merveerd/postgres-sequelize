const express = require('express');
const router = express.Router();
const country_boatController = require('../controllers').country_boat;
const boatController = require('../controllers').boat;

router
  .route('/')
  .get(country_boatController.listAll)
  .post(country_boatController.create);

router
  .route('/:type/:country')
  .get(country_boatController.listByCapacityTypeCountry);

module.exports = router;
