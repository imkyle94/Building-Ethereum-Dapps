const SimpleCoin = artifacts.require("./SimpleCoin.sol");

contract('SimpleCoin', function(accounts) {
	contract('SimpleCoin.Constructor', function(accounts) {
		it("Contract owner is sender", async function() {
			
			let simpleCoinInstance = await SimpleCoin.deployed();
			let contractOwner = await simpleCoinInstance.owner();
			
			assert.equal(contractOwner.valueOf(), accounts[0], "accounts[0] wasn't the contract owner");
		});
	});
});