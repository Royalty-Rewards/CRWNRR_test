// Allows us to use ES6 in our migrations and tests.
require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 4712388,
      gasPrice: 100000000000,
    },
    rpc: {
      host: "127.0.0.1",
      port: 8545
    },
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
