const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
      arguments: [''],
    })
    .send({
      from: accounts[0],
      gas: 1500000,
    });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: 1500000,
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
  it('Deploys a factory & campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and makes them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200',
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    // console.log(isContributor);
    assert.ok(isContributor);
  });

  it('requires a minimum amount of ether to contribute', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '100',
      });
    } catch (error) {
      // console.log(error);
      assert(error);
      return;
    }
    assert(false);
  });

  it('Allows a manager to create a payment request', async () => {
    await campaign.methods
      .createRequest('Buy Batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });
    const request = await campaign.methods.requests(0).call();
    // console.log(request);
    assert.equal('Buy Batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods
      .createRequest(
        'Buy Batteries',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    // 104999827271999999800
    // console.log(balance);
    balance = web3.utils.fromWei(balance, 'ether');
    // Ether 104.9998272719999998
    // console.log('Ether', balance);
    balance = parseFloat(balance);
    //104.999827272
    // console.log(balance);

    assert(balance > 104);
  });
});
