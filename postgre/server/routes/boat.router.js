const express = require('express');
const router = express.Router();
const boatController = require('../controllers').boat;

router.route('/').post(boatController.create).get(boatController.list);
router.route('/:id').get(boatController.getOne).patch(boatController.update);

module.exports = router;
