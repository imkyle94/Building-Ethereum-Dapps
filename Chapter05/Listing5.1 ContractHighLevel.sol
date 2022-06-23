pragma solidity ^0.4.24;
contract AuthorizedToken {
	
  enum UserType {TokenHolder, Admin, Owner}  //#A

  struct AccountInfo { //#B
	address account;
	string firstName;
	string lastName;
	UserType userType;
  }
	
  mapping (address => uint256) public tokenBalance; //#C
  mapping (address => AccountInfo) public registeredAccount; //#C
  mapping (address => bool) public frozenAccount; //#C
	
  address public owner; //#C
	
  uint256 public constant maxTranferLimit = 15000;
    
  event Transfer(address indexed from, address indexed to, uint256 value); //#D
  event FrozenAccount(address target, bool frozen); //#D
	
  modifier onlyOwner { //#E
    require(msg.sender == owner);
    _;
  }
	
  constructor(uint256 _initialSupply) public { //#F
    owner = msg.sender;
		 
    mintToken(owner, _initialSupply);   
  }

  function transfer(address _to, uint256 _amount) public { //#G
    require(checkLimit(_amount));
    //... 
    emit Transfer(msg.sender, _to, _amount);
  }  
	
  function registerAccount(address account, string firstName, //#G
    string lastName, bool isAdmin) public onlyOwner {
    //...
  }
	
  function checkLimit(uint256 _amount) private //#G
    returns (bool) { 
    if (_amount < maxTranferLimit) 
        return true;
    return false;
  }

  function validateAccount(address _account) internal  //#G
    returns (bool) { 
    if (frozenAccount[_account] && tokenBalance[_account] > 0) 
        return true;
    return false;
  }

  function mintToken(address _recipient, uint256  _mintedAmount) //#H
    onlyOwner public  { 
    tokenBalance[_recipient] += _mintedAmount;
    emit Transfer(owner, _recipient, _mintedAmount);
    }

  function freezeAccount(address target, bool freeze) //#H
    onlyOwner public  { 
    frozenAccount[target] = freeze; 
    emit FrozenAccount(target, freeze);
  }
}
#A enum definition
#B struct definition
#C state variable definitions
#D event definitions
#E function modifier definition
#F constructor definition
#G function definitions
#H function defined with modifier