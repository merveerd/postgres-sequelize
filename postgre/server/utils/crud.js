var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

client.on('error', function (err) {
  console.log('Something went wrong ', err);
});

const getOne = (model) => async (req, res) => {
  client.get(`${model.name}-${req.params.id}`, function (err, object) {
    if (object) {
      console.log('cache data getOne');
      return res.status(200).json({ data: JSON.parse(object) });
    } else {
      return model
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          client.set(
            `${model.name}-${req.params.id}`,
            JSON.stringify(result),
            'EX',
            30 * 60,
            (err) => {
              if (err) {
                console.log('set error', err);
              }
            }
          );
          res.status(200).json({ data: result });
        })
        .catch((err) => {
          res.status(404).json({ message: err });
        });
    }
  });
};

const list = (model) => async (req, res) => {
  try {
    client.get(`${model.name}-all`, async function (err, object) {
      if (object) {
        console.log('cache data list');
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
        const doc = await model.findAll();
        client.set(
          `${model.name}-all`,
          JSON.stringify(doc),
          'EX',
          30 * 60,
          (err) => {
            if (err) {
              console.log('set error', err);
            }
          }
        );

        res.status(200).json({ data: doc });
      }
    });
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
        .then((updatingItem) => {
          client.del(`${model.name}-all`, function (err, response) {
            if (response == 1) {
              console.log('Deleted Successfully!');
            } else {
              console.log('Cannot delete', response, err);
            }
          });

          client.del(`${model.name}-${req.params.id}`, function (
            err,
            response
          ) {
            if (response == 1) {
              console.log('Deleted Successfully!');
            } else {
              console.log('Cannot delete', response, err);
            }
          });
          return res.status(201).json({ data: updatingItem });
        })
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
