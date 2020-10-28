const getOne = (model) => async (req, res) => {
  try {
    const doc = await model.findByPk(req.params.id);
    if (!doc) {
      return res.status(404).send({
        message: 'model is not found',
      });
    }
    res.status(200).json({ data: doc });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const list = (model) => async (req, res) => {
  try {
    const doc = await model.findAll();
    res.status(200).json({ data: doc });
  } catch (err) {
    (err) => res.status(400).send(err);
  }
};

module.exports = function crudController(model) {
  return {
    getOne: getOne(model),
    list: list(model),
    // updateOne: updateOne(model)
  };
};
