pragma solidity ^0.4.24;
contract SimpleCoin {
  mapping (address => uint256) public coinBalance;
  mapping (address => mapping (address => uint256)) public allowance;
  mapping (address => bool) public frozenAccount;
  address public owner;
    
  event Transfer(address indexed from, address indexed to, uint256 value);
  event FrozenAccount(address target, bool frozen);
   
  modifier onlyOwner {
    if (msg.sender != owner) revert();
    _;
  }

  constructor(uint256 _initialSupply) public {
    owner = msg.sender;

    mint(owner, _initialSupply);//#A
  }
    
  function transfer(address _to, uint256 _amount) public {
    require(_to != 0x0); 
    require(coinBalance[msg.sender] > _amount);
    require(coinBalance[_to] + _amount >= coinBalance[_to] );
    coinBalance[msg.sender] -= _amount;  
    coinBalance[_to] += _amount;   
    emit Transfer(msg.sender, _to, _amount);  
  }
    
  function authorize(address _authorizedAccount, uint256 _allowance) 
    public returns (bool success) {
    allowance[msg.sender][_authorizedAccount] = _allowance; 
    return true;
  }
    
  function transferFrom(address _from, address _to, uint256 _amount) 
    public returns (bool success) {
    require(_to != 0x0);  //#A
    require(coinBalance[_from] > _amount); //#B
    require(coinBalance[_to] + _amount >= coinBalance[_to] ); //#C
    require(_amount <= allowance[_from][msg.sender]); //#D 
    
    coinBalance[_from] -= _amount; //#E
    coinBalance[_to] += _amount; //#F
    allowance[_from][msg.sender] -= _amount;//#G
    emit Transfer(_from, _to, _amount);//H
    return true;
  }
    
  function mint(address _recipient, uint256  _mintedAmount) 
    onlyOwner public { //#A
            
    coinBalance[_recipient] += _mintedAmount; 
    emit Transfer(owner, _recipient, _mintedAmount); 
  }
    
  function freezeAccount(address target, bool freeze) 
    onlyOwner public { //#A

    frozenAccount[target] = freeze;  
    emit FrozenAccount(target, freeze);
  }
}