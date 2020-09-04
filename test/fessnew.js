const FessNew = artifacts.require('FessNew.sol');


const { increaseTimeTo, duration } = require('openzeppelin-solidity/test/helpers/increaseTime');
const { latestTime } = require('openzeppelin-solidity/test/helpers/latestTime');

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var Web3Utils = require('web3-utils');

contract('FessNew Contract', async (accounts) => {


    it('Should correctly initialize constructor of FessChain token Contract', async () => {

        this.tokenhold = await FessNew.new(accounts[0], { gas: 600000000 });

    });

    it('Should check a name of a Fess new', async () => {

        let name = await this.tokenhold.name.call();
        assert.equal(name, "FESS NEW");

    });

    it('Should check a symbol of a fess new contract', async () => {

        let symbol = await this.tokenhold.symbol.call();
        assert.equal(symbol, "FESSNEW");

    });

    it('Should check a decimal of a stable', async () => {

        let decimals = await this.tokenhold.decimals.call();
        assert.equal(decimals, 18);

    });

    it('Should check a owner of a fess new contract', async () => {

        let owner = await this.tokenhold.owner.call();
        assert.equal(owner, accounts[0]);

    });

    it('Should check a totalSupply of a fess new contract', async () => {

        let totalSupply = await this.tokenhold.totalSupply.call();
        assert.equal(totalSupply/10**18, 250000000);

    });

    it('Should check a balance of a fess new contract owner', async () => {

        let balanceOf = await this.tokenhold.balanceOf.call(accounts[0]);
        assert.equal(balanceOf/10**18, 62500000);

    });

    it('Should check distribution tokens sent', async () => {

        let balanceOf = await this.tokenhold.DistributionTokensSent.call();
        assert.equal(balanceOf/10**18, 62500000);

    });

    it('Should check Team tokens left', async () => {

        let teamTokens = await this.tokenhold.teamTokensLeft.call();
        assert.equal(teamTokens/10**18, 62500000);

    });

    it('Should check marketing tokens left', async () => {

        let MarketingTokensLeft = await this.tokenhold.MarketingTokensLeft.call();
        assert.equal(MarketingTokensLeft/10**18, 62500000);

    });

    it('Should check marketing tokens left', async () => {

        let MaintenanceTokensLeft = await this.tokenhold.MaintenanceTokensLeft.call();
        assert.equal(MaintenanceTokensLeft/10**18, 62500000);

    });

   it('Should check tokens Released of Fess new', async () => {

    let totalReleased = await this.tokenhold.totalReleased();
    assert.equal(totalReleased / 10 ** 18, 62500000);

  });

  it("Should be able to pause Fesschain Token contract", async () => {

    var pauseStatusBefore = await this.tokenhold.paused.call();
    assert.equal(pauseStatusBefore, false);
    await this.tokenhold.pause({ from: accounts[0] });
    var pauseStatusAfter = await this.tokenhold.paused.call();
    assert.equal(pauseStatusAfter, true);
  });

  it('Should Not be able to transfer tokens to accounts[1] by toke contract owner when paused', async () => {

    try {

      let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
      assert.equal(balanceOfOwner / 10 ** 18, 62500000);
      let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[1]);
      assert.equal(balanceOfBeneficiary, 0);
      await this.tokenhold.transfer(accounts[1], web3.utils.toHex(2*10**18), { from: accounts[0], gas: 5000000 });

    } catch (error) {

      var error_ = 'Returned error: VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it("Should be able unPause Token contract", async () => {
    var pauseStatusBefore = await this.tokenhold.paused.call();
    assert.equal(pauseStatusBefore, true);
    await this.tokenhold.unpause({ from: accounts[0] });
    var pauseStatusAfter = await this.tokenhold.paused.call();
    assert.equal(pauseStatusAfter, false);
  });

  it('Should be able to transfer tokens to accounts[1] of Sale tokens only by Owner when not paused', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner / 10 ** 18, 62500000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiary, 0);
    await this.tokenhold.transfer(accounts[1], web3.utils.toHex(625* 10 ** 18), { from: accounts[0], gas: 5000000 });
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater / 10 ** 18, 62499375);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiaryLater / 10 ** 18, 625);

  });

  it("Should be able to pause Fesschain Token contract", async () => {

    var pauseStatusBefore = await this.tokenhold.paused.call();
    assert.equal(pauseStatusBefore, false);
    await this.tokenhold.pause({ from: accounts[0] });
    var pauseStatusAfter = await this.tokenhold.paused.call();
    assert.equal(pauseStatusAfter, true);
  });

  it('Should Not be able to send marketing Tokens by owner When it is Paused', async () => {

    try {
      let MarketingTokensLeft = await this.tokenhold.MarketingTokensLeft();
      assert.equal(MarketingTokensLeft / 10 ** 18, 62500000);
      let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[2]);
      assert.equal(balanceOfBeneficiary, 0);
      await this.tokenhold.sendMarketingTokens(accounts[2], web3.utils.toHex(625* 10 ** 18), { from: accounts[0], gas: 5000000 });
    } catch (error) {

      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }


  });

  it("Should be able unPause Token contract", async () => {
    var pauseStatusBefore = await this.tokenhold.paused.call();
    assert.equal(pauseStatusBefore, true);
    await this.tokenhold.unpause({ from: accounts[0] });
    var pauseStatusAfter = await this.tokenhold.paused.call();
    assert.equal(pauseStatusAfter, false);
  });

  it('Should be able to send marketing Tokens by owner only', async () => {

    let MarketingTokensLeft = await this.tokenhold.MarketingTokensLeft();
    assert.equal(MarketingTokensLeft / 10 ** 18, 62500000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfBeneficiary, 0);
    await this.tokenhold.sendMrketingTokens(accounts[2], web3.utils.toHex(1000* 10 ** 18), { from: accounts[0], gas: 5000000 });
    let MarketingTokensLeftLater = await this.tokenhold.MarketingTokensLeft();
    assert.equal(MarketingTokensLeftLater / 10 ** 18, 62499000);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfBeneficiaryLater / 10 ** 18, 1000);

  });

})

