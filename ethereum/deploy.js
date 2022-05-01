const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const campaignFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'air pledge achieve enroll dad dwarf omit rail pilot above yellow return',
  'https://rinkeby.infura.io/v3/b3e812dcb6d3485bbced2a87ea4c11df'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const lottery = await new web3.eth.Contract(campaignFactory.abi)
    .deploy({
      data: campaignFactory.evm.bytecode.object,
      arguments: [],
    })
    .send({ from: accounts[0], gas: 2000000 });
  console.log('Contract Deployed to ', lottery.options.address);
  provider.engine.stop();
};

deploy();

// Deployed to : 0x08f8752322a517fAe94dBa5Eb4253F870337882f
