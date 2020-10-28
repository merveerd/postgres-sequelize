const db = require('../models');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(6379, 'localhost');

//the library doesnt support findByPk
const getOne = (model) => async (req, res) => {
  var cacheObj = cacher(db.sequelize, rc).model(model.name).ttl(1800);
  return cacheObj
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((result) => {
      res.status(200).json({ data: result });
      console.log(cacheObj.cacheHit); // true or false
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};

const list = (model) => async (req, res) => {
  var cacheObj = cacher(db.sequelize, rc).model(model.name).ttl(1800);
  try {
    const doc = await cacheObj.findAll();
    console.log(cacheObj.cacheHit); // true or false
    res.status(200).json({ data: doc });
  } catch (err) {
    (err) => res.status(400).send(err);
  }
};
const update = (model) => async (req, res) => {
  let keys = Object.keys(req.body),
    updateObject = {};
  keys.forEach((item) => {
    updateObject[item] =
      typeof req.body[item] === 'string'
        ? req.body[item].toLowerCase()
        : req.body[item];
  });

  return model
    .findByPk(req.params.id)
    .then((updatingItem) => {
      if (!updatingItem) {
        return res.status(404).send({
          message: 'updatingItem is not found',
        });
      }

      return updatingItem
        .update(updateObject)
        .then((updatingItem) => res.status(201).json({ data: updatingItem }))
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};

module.exports = function crudController(model) {
  return {
    getOne: getOne(model),
    list: list(model),
    update: update(model),
  };
};
