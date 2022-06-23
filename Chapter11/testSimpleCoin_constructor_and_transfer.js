const SimpleCoin = artifacts.require("./SimpleCoin.sol");

//TODO: REWRITE ALL TETST USING ASYNC/AWAIT AS IN OPEN-ZEPPELIN:
	//https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/test
	//FOLLOW THIS ARTICLE FOR CORRECT SETUP: 
		//https://medium.com/hello-sugoi/testing-solidity-with-truffle-and-async-await-396e81c54f93
	//WRITE TESTS CATChING EVENTS AS HERE:
		//https://github.com/vincentlg/projectforreproduce/blob/master/test/crowdFunding.js
		

contract('SimpleCoin', function(accounts) {
	contract('SimpleCoin.Constructor', function(accounts) {
		it("Contract owner is sender", function() {
			return SimpleCoin.deployed().then(function(instance) {
				return instance.owner();
			}).then(function(contractOwner) {
				assert.equal(contractOwner.valueOf(), accounts[0], "accounts[0] wasn't the contract owner");
			});
		});	
		it("Contract owner balance is equal to initialSupply", function() {
			return SimpleCoin.deployed().then(function(instance) {
			//get owner form instange.owner() when using async/await, ratyher than using account[0] drectly
				return instance.coinBalance(accounts[0]);
			}).then(function(contractOwnerBalance) {
				assert.equal(contractOwnerBalance.valueOf(), 10000, "the contract owner balance is not equal to the full supply of 10000");
			});
		});
	}); 
	contract('SimpleCoin.transfer', function(accounts) {
		it("Succesful transfer: final sender and recipient balances are correct", function() {
			//arrange 
			let sender = web3.eth.accounts[0];
			let recipient = web3.eth.accounts[1];
			let tokensToTransfer = 200;
			
			const expectedSenderBalance = 9800;
			const expectedRecipientBalance = 200;
			
			//act
			return SimpleCoin.deployed().then(function(instance) {
			  simpleCoin = instance;
			  return simpleCoin.transfer(recipient, tokensToTransfer, {from: sender});
			}).then(function() {
			  return simpleCoin.coinBalance(sender);
			}).then(function(balance) {
			  sender_ending_balance = balance.toNumber();
			  return simpleCoin.coinBalance(recipient);
			}).then(function(balance) {
			  recipient_ending_balance = balance.toNumber();

			  //assert
			  assert.equal(sender_ending_balance, expectedSenderBalance, "Amount wasn't correctly taken from the sender");
			  assert.equal(recipient_ending_balance, expectedRecipientBalance, "Amount wasn't correctly sent to the receiver");
			});						
		});		
	});	
});