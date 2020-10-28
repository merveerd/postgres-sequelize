const express = require('express');
const router = express.Router();
const country_boatController = require('../controllers').country_boat;

router
  .route('/')
  .get(country_boatController.listAll)
  .post(country_boatController.create)
  .delete(country_boatController.delete);

router.route('/:country').get(country_boatController.listByCountry);

router
  .route('/:type/:country')
  .get(country_boatController.listByCapacityTypeCountrywithCache);

module.exports = router;
