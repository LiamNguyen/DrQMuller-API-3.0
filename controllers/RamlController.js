const raml2html = require('raml2html');

const ApiError = require('../constants/ApiError');
const config = require('../config/environmentConfig');

exports.GET = (request, response, next) => {
  const { ramlBaseUrl } = config.get(process.env.NODE_ENV);
  raml2html.render(
    `${ramlBaseUrl}/public/api.raml`,
    raml2html.getConfigForTheme()
  ).then(result => {
    response.send(result);
  }, raml2htmlError => {
    response.locals.clientError = ApiError.server_error;
    response.locals.error = raml2htmlError;
    next();
  });
};
