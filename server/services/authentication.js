const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const createPasswordHash = (plainPassword) => bcrypt.hash(plainPassword, saltRounds);
const validatePassword = (plainPassword, savedHash) => bcrypt.compare(plainPassword, savedHash);

const createJwt = (payload, options) => {
  const privateKey = process.env.AUTHPRIVATEKEY;
  // Token signing options
  const signOptions = {
    issuer: 'myneighborsfarm',
    audience: options.audience,
    algorithm: 'RS256'
  };
  return jwt.sign(payload, privateKey, signOptions);
};

const verifyJwt = (token, options) => {
  const publicKey = process.env.AUTHPUBLICKEY;
  const verifyOptions = {
    issuer: 'myneighborsfarm',
    audience: options.audience,
    algorithms: ['RS256']
  };
  try {
    return jwt.verify(token, publicKey, verifyOptions);
  } catch (err) {
    return false;
  }
};

const decodeJwt = (token) => jwt.decode(token, { complete: true });

// const token = createJwt({ id: 10 }, { audience: '/' });
// console.log('token', token);
//
// const verified = verifyJwt(token, { audience: '/' });
// console.log('verified', verified);

module.exports = {
  createPasswordHash,
  validatePassword,
  createJwt,
  verifyJwt,
  decodeJwt
};
