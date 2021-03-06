const Raml = require('create-raml');
const fs = require('fs');
const config = require('../config/environmentConfig');

const server = require('../server');

const raml = new Raml({
  title: 'DrQMuller v3.0',
  baseUri: config.get(process.env.NODE_ENV).baseUrl,
  version: 'v1'
});

raml.methods('signin', 'post', {
  description: 'User signin',
  responses: {
    200: {
      'application/json': {
        authorizationToken: '53292990-3645-11e8-af05-bd47a7e93b38'
      }
    },
    400: {
      'application/json': {
        error_message: 'Invalid username or password',
        error_code: 'invalid_username_or_password'
      }
    }
  }
});

raml.methods('signout', 'post', {
  description: 'User signout',
  responses: {
    200: {
      'application/json': {}
    },
    400: {
      'application/json': {
        error_message: 'There was a server error',
        error_code: 'server_error'
      }
    },
    401: {
      'application/json': {}
    }
  }
});

raml.methods('user', 'post', {
  description: 'Create new user',
  responses: {
    201: {
      'application/json': {}
    },
    400: {
      'application/json': {
        error_message: 'There was a server error',
        error_code: 'server_error'
      }
    }
  }
});

raml.methods('/user/me', 'patch', {
  description: 'Update user information',
  responses: {
    200: {
      'application/json': {}
    },
    400: {
      'application/json': {
        error_message: 'There was a server error',
        error_code: 'server_error'
      }
    },
    401: {
      'application/json': {}
    }
  }
});

raml.methods('/resetPasswordRequest', 'post', {
  description: 'Send reset password request',
  responses: {
    200: {
      'application/json': {}
    },
    400: {
      'application/json': {
        error_message: 'There was a server error',
        error_code: 'server_error'
      }
    }
  }
});

module.exports.generate = () => {
  const docsPath = `${server.rootDirectory}/public/api_autogenerated.raml`;

  raml.generate((error, ramlText) => {
    fs.writeFile(docsPath, ramlText, fsWriteFileError => {
      if (fsWriteFileError) {
        console.log(fsWriteFileError);
      } else {
        console.log('Raml successfully auto generated');
      }
    });
  });
};
