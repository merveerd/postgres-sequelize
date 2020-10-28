const express = require('express');
const router = express.Router();
const country_boatController = require('../controllers').country_boat;

router
  .route('/')
  .get(country_boatController.listAllByCache)
  .post(country_boatController.create);

router
  .route('/:type/:country')
  .get(country_boatController.listByCapacityTypeCountrywithCache);

module.exports = router;
