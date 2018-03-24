const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let farmContract;
beforeEach(async () => {
accounts = await web3.eth.getAccounts();
farmContract = await new web3.eth.Contract(JSON.parse(interface))
.deploy({data:bytecode, arguments:[]})
.send({from: accounts[0], gas:1000000, value: 1000000000000});

farmContract.setProvider(provider);
});

describe('Farm Contract', () => {

  it('deploys contract', () => {
  assert.ok(farmContract.options.address);
  });

  it('Verify get quote method', async () => {
    const result = await farmContract.methods.getQuote().call();
    assert.equal(100, result);
  });

  it("verify bind and get insured details methods", async () =>{
      await farmContract.methods.bind("hari", "krishna", "NORAIN", 1200, 100)
      .send({from:accounts[1], gas:1000000});

      const result = await farmContract.methods.getInsuredDetails(accounts[1]).call();
      assert.equal('hari', result[0]);
      assert.equal('krishna', result[1]);
  });

  it('verify claim processing method', async () => {
    await farmContract.methods.bind("hari", "krishna", "NORAIN", 120000000, 100)
    .send({from:accounts[1], gas:1000000});

    const currentBalance = await farmContract.methods.getBalance(accounts[1]).call();

    await farmContract.methods.claimProcessing('NORAIN')
    .send({from: accounts[0], gas:1000000});

    const balanceAfterClaimProcessing = await
    farmContract.methods.getBalance(accounts[1]).call();

    assert.notEqual(currentBalance, balanceAfterClaimProcessing);
  });
});
