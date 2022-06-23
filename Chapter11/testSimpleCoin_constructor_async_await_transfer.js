const SimpleCoin = artifacts.require("./SimpleCoin.sol");

contract('SimpleCoin', function(accounts) {
	contract('SimpleCoin.Constructor', function(accounts) {
		it("Contract owner is sender", async function() {
			
			let simpleCoinInstance = await SimpleCoin.deployed();
			let contractOwner = await simpleCoinInstance.owner();
			
			assert.equal(contractOwner.valueOf(), accounts[0], "accounts[0] wasn't the contract owner");
		});
	});
	
	contract('SimpleCoin.transfer', function(accounts) {
		it("Successful transfer: final sender and recipient balances are correct", async function() {
			//arrange 
			let sender = web3.eth.accounts[0];
			let recipient = web3.eth.accounts[1];
			let tokensToTransfer = 200;
			
			const expectedSenderBalance = 9800;
			const expectedRecipientBalance = 200;
			
			let simpleCoinInstance = await SimpleCoin.deployed();
			
			//act
			await simpleCoinInstance.transfer(recipient, tokensToTransfer, {from: sender});
			let sender_ending_balance = await simpleCoinInstance.coinBalance(sender);
			let recipient_ending_balance = await simpleCoinInstance.coinBalance(recipient);			

			//assert
			assert.equal(sender_ending_balance.valueOf(), expectedSenderBalance, "Amount wasn't correctly taken from the sender");
			assert.equal(recipient_ending_balance.valueOf(), expectedRecipientBalance, "Amount wasn't correctly sent to the receiver");						
		});		
	});	
});