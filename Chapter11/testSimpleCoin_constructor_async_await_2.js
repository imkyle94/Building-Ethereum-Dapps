const SimpleCoin = artifacts.require("./SimpleCoin.sol");

contract('SimpleCoin', function(accounts) {
	contract('SimpleCoin.Constructor', function(accounts) {
		it("Contract owner is sender", async function() {
			
			let simpleCoinInstance = await SimpleCoin.deployed();
			let contractOwner = await simpleCoinInstance.owner();
			
			assert.equal(contractOwner.valueOf(), accounts[0], "accounts[0] wasn't the contract owner");
		});
		
		it("Contract owner balance is equal to initialSupply", async function() {
			let simpleCoinInstance = await SimpleCoin.deployed();
			let contractOwnerBalance = await simpleCoinInstance.coinBalance(accounts[0]);

			assert.equal(contractOwnerBalance.valueOf(), 10000, "the contract owner balance is not equal to the full supply of 10000");
		});		
	});
});