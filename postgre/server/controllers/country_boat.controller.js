const countries = require('../models').country;
const boats = require('../models').boat;
const country_boats = require('../models').country_boat;

const Op = require('../models').Sequelize.Op;
const db = require('../models');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(6379, 'localhost');

var cacheObj = cacher(db.sequelize, rc).model('country_boat').ttl(1800);

module.exports = {
  create(req, res) {
    return country_boats
      .create({
        country_id: req.body.country_id,
        boat_id: req.body.boat_id,
      })
      .then((result) => res.status(201).json({ data: result }))
      .catch((error) => res.status(400).send(error));
  },

  listByCapacityTypeCountrywithCache(req, res) {
    console.log('list by', req.params);
    return (
      cacheObj
        .findAll({
          raw: true,
          attributes: [['boat_id', 'boat id']],
          include: [
            {
              model: countries,
              where: {
                name: req.params.country.toLowerCase(),
              },
              as: 'countries',
              attributes: [['name', 'name']],
            },
            {
              model: boats,
              where: {
                capacity: {
                  [Op.between]: [req.body.minCap, req.body.maxCap],
                },
                type: req.params.type,
              },
              as: 'boats',
              attributes: [
                ['name', 'name'],
                ['capacity', 'capacity'],
              ],
            },
          ],
        })
        .then(function (result) {
          res.status(200).json({ data: result });
          console.log(cacheObj.cacheHit); // true or false
        })
        // .then((result) => res.status(200).send(result))
        .catch((error) => res.status(400).send(error))
    );
  },

  listAllByCache(req, res) {
    console.log('req.params', req.params);
    return cacheObj
      .findAll({
        raw: true,
        attributes: [['boat_id', 'boat id']],
        include: [
          {
            model: countries,
            as: 'countries',
            attributes: [['name', 'name']],
          },
          {
            model: boats,
            as: 'boats',
            attributes: [
              ['name', 'name'],
              ['capacity', 'capacity'],
              ['type', 'type'],
            ],
          },
        ],
      })
      .then(function (result) {
        res.status(200).json({ data: result });
        console.log(cacheObj.cacheHit); // true or false
      })
      .catch((error) => res.status(400).send(error));
  },
};
