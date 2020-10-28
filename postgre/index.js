const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

const port = 4000;

const countryRoute = require('./server/routes/country.router');
app.use('/country', countryRoute);

const boatRoute = require('./server/routes/boat.router');
app.use('/boat', boatRoute);

const country_boatRoute = require('./server/routes/country_boat.router');
app.use('/', country_boatRoute);

app.get('*', (req, res) =>
  res.status(200).json({
    message: 'There is no root provided.',
  })
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
