const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3'); 
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); 

const source = fs.readFileSync('c:/Ethereum/SimpleCoinWithNode/SimpleCoin.sol', 'utf8');
const compiledContract = solc.compile(source, 1);
const abi = compiledContract.contracts[':SimpleCoin'].interface;

const SimpleCoinContractFactory = web3.eth.contract(JSON.parse(abi));
const contractAddress = '0xa9d460c5aba794db20d005f54e8eefa80b76ff2e'; //replace appropriately

const simpleCoinInstance = SimpleCoinContractFactory.at(contractAddress);

const account2 = web3.eth.accounts[1]; //account2
const account3 = web3.eth.accounts[2]; //account3

var account2Balance = simpleCoinInstance.coinBalance(account2)
var account3Balance = simpleCoinInstance.coinBalance(account3)

console.log('BALANCES BEFORE transfering tokens');
console.log('Account 2 balance: ' + account2Balance);
console.log('Account 3 balance: ' + account3Balance);

web3.personal.unlockAccount(account2, "account2")

var transactionHash = simpleCoinInstance.transfer(account3, 20, {from:account2,gas:200000});
console.log('SUBMITTED transfer() transaction. Transaction hash: ' + transactionHash);

var transactionReceipt = null;
while (transactionReceipt == null)
{
	transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
}

console.log('COMPLETED transfer() transaction. Transaction: ' + transactionHash + 'has been consolidated on block: ' + transactionReceipt.blockNumber);
account2Balance = simpleCoinInstance.coinBalance(account2);
account3Balance = simpleCoinInstance.coinBalance(account3);

console.log('BALANCES AFTER transfering tokens');
console.log('Account 2 balance: ' + account2Balance);
console.log('Account 3 balance: ' + account3Balance);




