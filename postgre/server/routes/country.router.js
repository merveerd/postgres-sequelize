const express = require('express');
const router = express.Router();
const countryController = require('../controllers').country;
const boatController = require('../controllers').boat;

router.route('/').post(countryController.create).get(countryController.list);

router.route('/:id').get(countryController.retrieve);

router.route('/:countryid/boats').post(boatController.create);

module.exports = router;
