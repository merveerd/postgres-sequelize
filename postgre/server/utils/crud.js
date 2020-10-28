const getOne = (model) => async (req, res) => {
  console.log('req.params.id', req.params.id);
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

module.exports = function crudController(model) {
  return {
    getOne: getOne(model),
    // updateOne: updateOne(model)
  };
};
