const fs = require('fs');

module.exports = {
  publicKey: fs.readFileSync(process.cwd() + '/keys/ecdsa-p521-public.pem'),
};
