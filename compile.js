const path = require('path');
const fs = require('fs');
const solc = require('solc');

const farmContractPath = path.resolve(__dirname, 'contracts', 'FarmContract.sol');

const source = fs.readFileSync(farmContractPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':FarmContract'];
