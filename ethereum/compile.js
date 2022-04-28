const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

// console.log(JSON.parse(solc.compile(JSON.stringify(input))));
/* {
  contracts: { 'Campaign.sol': { Campaign: [Object], CampaignFactory: [Object] } },
  sources: { 'Campaign.sol': { id: 0 } }
} */
const contracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Campaign.sol'
];

fs.ensureDirSync(buildPath);

for (const contract in contracts) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    contracts[contract]
  );
}
module.exports = contracts;
