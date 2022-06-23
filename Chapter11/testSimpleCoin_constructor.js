const SimpleCoin = artifacts.require("./SimpleCoin.sol");

contract('SimpleCoin', function(accounts) {
	contract('SimpleCoin.Constructor', function(accounts) {
		it("Contract owner is sender", function() {
			return SimpleCoin.deployed()
			.then(function(instance) {
				return instance.owner(); 
			 })
			.then(function(contractOwner) {
				assert.equal(contractOwner.valueOf(), accounts[0], "accounts[0] wasn't the contract owner");
			});
		});
	});
});