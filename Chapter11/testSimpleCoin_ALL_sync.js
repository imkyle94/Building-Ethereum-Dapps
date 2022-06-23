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
		/* REMOVE!!
		it("Cannot transfer a number of tokens higher than number of tokens owned", function() {
			////TODO:Tests for checking if exceptions have been thrown cannot be written easily with continuations
		});
		*/
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
	contract('SimpleCoin.authorize', function(accounts) {
		it("Successful authorization: the allowance of the authorized account is set correctly", function() {
			//arrange 
			let sender = web3.eth.accounts[0];
			let authorizer = web3.eth.accounts[2];
			let authorized = web3.eth.accounts[3];
			const allowance = 300;
			var final_authorized_allowance;
			
			return SimpleCoin.deployed().then(function(instance) {
			  simpleCoin = instance;
			  return simpleCoin.authorize(authorized, allowance, {from: authorizer});
			}).then(function() {
			  return simpleCoin.allowance(authorizer, authorized);
			}).then(function(authorizedAllowance) {
			  final_authorized_allowance = authorizedAllowance.toNumber();

			  assert.equal(final_authorized_allowance, allowance, "Allowance was not correctly set");
			});						
		});	
	});	
	
	contract('SimpleCoin.transferFrom', function(accounts) {
		it("Cannot transfer number of tokens higher than that owned by authorizer", function() {
			////TODO:Tests for checking if exceptions have been thrown cannot be written easily with continuations
		});
		it("Cannot transfer tokens from an account that has not authorized any account", function() {
			////TODO:Tests for checking if exceptions have been thrown cannot be written easily with continuations
		});
		it("Cannot transfer tokens by an account that has not been authorized", function() {
			////TODO:Tests for checking if exceptions have been thrown cannot be written easily with continuations
		});		
		it("Succesful transfer from authorizer to authorized: final source and destination balances are correct and allowance is reduced as expected", function() {

			//arrange 
			let sender = web3.eth.accounts[0];
			let authorizer = web3.eth.accounts[2];
			let authorized = web3.eth.accounts[3];
			let toAccount = web3.eth.accounts[5];
			let allowance = 300;
			let initialBalanceOfAuthorizer = 400;				
			let tokensToTransfer = 250;
			
			var final_authorizer_balance;
			var final_destination_account_balance;
			var final_allowance;
			
			return SimpleCoin.deployed().then(function(instance) {
				simpleCoin = instance;
				
				//arrange
				simpleCoin.authorize(authorized, allowance, {from:authorizer});					
				simpleCoin.transfer(authorizer, initialBalanceOfAuthorizer, {from:sender});					
				
				//act
				simpleCoin.transferFrom(authorizer, toAccount, tokensToTransfer, {from:authorized});
			}).then(function() {
			  return simpleCoin.coinBalance(authorizer);
			}).then(function(balance) {
			  final_authorizer_balance = balance.toNumber();
			  return simpleCoin.coinBalance(toAccount);
			}).then(function(balance) {	
			  final_destination_account_balance = balance.toNumber();
			  return simpleCoin.allowance(authorizer, authorized);
			}).then(function(final_allowance) {				  
				
			  final_allowance = final_allowance.toNumber();
			  
			  //assert
			  const expected_authorizer_balance = 150;
			  const expected_destination_account_balance = 250;	
			  const expected_final_allowance = 50;			  

			  assert.equal(final_authorizer_balance, expected_authorizer_balance, "authorizer_balance was not correctly set");
			  assert.equal(final_destination_account_balance, expected_destination_account_balance, "destination_account_balance was not correctly set");
			  assert.equal(final_allowance, expected_final_allowance, "authorizedAllowance was not correctly set");
			});						
		});	
	});		
	
	contract('SimpleCoin.mint', function(accounts) {
		it("Cannot mint from no owner account", function() {
			////TODO:Tests for checking if exceptions have been thrown cannot be written easily with continuations
		});
		it("Succesful minting: the recipient has the correct balance", function() {
			//arrange 
			let sender = web3.eth.accounts[0];
			
			let recipient = web3.eth.accounts[3];
			let mintedCoins = 3000;
			
			var final_recipient_balance;
			
			return SimpleCoin.deployed().then(function(instance) {
				simpleCoin = instance;				
				
				//act
				simpleCoin.mint(recipient, mintedCoins, {from:sender});
			}).then(function() {
			  return simpleCoin.coinBalance(recipient);
			}).then(function(balance) {
			  final_recipient_balance = balance.toNumber();
			  
			  //assert  
			  assert.equal(final_recipient_balance, mintedCoins, "minting did not produce the expected number of coins");
			});						
		});	
	});	

	contract('SimpleCoin.freezeAccount', function(accounts) {
		it("Cannot freezing from no owner account", function() {
			////TODO:Tests for checking if exceptions have been thrown cannot be written easily with continuations
		});
		it("Succesful freezing: the recipient has the correct balance", function() {
			//arrange 
			let sender = web3.eth.accounts[0];
			let initialSupply = 10000;
			
			let frozen = web3.eth.accounts[3];
					
			return SimpleCoin.deployed().then(function(instance) {
				simpleCoin = instance;				
				
				//act
				simpleCoin.freezeAccount(frozen, true, {from:sender});
			}).then(function() {
			  return simpleCoin.frozenAccount(frozen);
			}).then(function(isFrozen) {
			  
			  //assert  
			  assert.equal(isFrozen, true, "the expected account did not get frozen");
			});						
		});	
	});		
	
});