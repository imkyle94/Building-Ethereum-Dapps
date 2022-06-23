pragma solidity ^0.4.16;
contract AuthorizedToken {
	
	enum UserType {TokenHolder, Admin, Owner}

	struct AccountInfo {
		   address address;
		   atring firstName;
		   atring lastName;
		   UserType type;
	}
	
    mapping (address => uint256) public tokenBalance;
	mapping (address => AccountInfo) public registeredAccount;
	mapping (address => bool) public frozenAccount;
	
	address public owner;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
	event FrozenAccount(address target, bool frozen);
	
	modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
	
	constructor(uint256 _initialSupply) public {
         owner = msg.sender;
		 
         mintToken(owner, _initialSupply);   
    }

    function transfer(address _to, uint256 _amount) {
		... 
    }  
	
	function registerAccount(address account, string firstName, string lastName, bool isAdmin) onlyOwner {
	{
		UserType userType;
		if (isAdmin) 
			userType = UserType.Admin;
		else
			userType = UserType.TokenHolder;
		AccountInfo accoountInfo = AccountInfo({address=account; firstName = firstName; lastName = lastName; type=userType});

		registeredAccount[address] = accoountInfo;
	}

	function mintToken(address _recipient, uint256  _mintedAmount) onlyOwner {
		tokenBalance[_recipient] += _mintedAmount;
		emit Transfer(owner, _recipient, _mintedAmount);
	}

	function freezeAccount(address target, bool freeze) onlyOwner  {
		frozenAccount[target] = freeze; 
		emit FrozenAccount(target, freeze);
	}
}
