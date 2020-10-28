const express = require('express');
const router = express.Router();
const boatController = require('../controllers').boat;

router.route('/').get((req, res) =>
  res.status(200).send({
    message: 'Welcome to the sail boats!',
  })
);

router.route('/').post(boatController.create);
router.route('/:id').get(boatController.getOne);

module.exports = router;
