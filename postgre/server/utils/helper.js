var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

client.on('error', function (err) {
  console.log('Something went wrong ', err);
});

exports.cacheRemover = (key) => {
  client.del(key, function (err, response) {
    if (response == 1) {
      console.log(`${key} Deleted Successfully!`);
    } else {
      console.log('Cannot delete', response, err);
    }
  });
};

exports.cacheSetter = (key, data) => {
  client.set(`${key}`, JSON.stringify(data), 'EX', 30 * 60, (err) => {
    if (err) {
      console.log('set error', err);
    }
  });
};
