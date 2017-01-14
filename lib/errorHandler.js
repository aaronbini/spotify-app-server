// eslint-disable-next-line no-unused-vars
function errorHandler (err, req, res, next) {
  if (err.code === 404) next();
  console.log('error message: ', err.message || err);
  res.status(err.statusCode || err.code || 500).send({error: err.message || err.error || err});
};

module.exports = errorHandler;