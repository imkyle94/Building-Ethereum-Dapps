pragma solidity ^0.4.16;
contract AuthorizedToken {
	
    //...
	
    mapping (address => uint256) public tokenBalance; 
    mapping (address => bool) public frozenAccount;
	
    address public owner; //#C
    uint256 public constant maxTranferLimit = 50000;
	
    //...

    function transfer(address _to, uint256 _amount) public { 
        require(checkLimit(_amount));
        //... 
        tokenBalance[msg.sender] -= _amount;//#A
        tokenBalance[_to] += _amount;//#A
        Transfer(msg.sender, _to, _amount);
    }  
	
    //...
	
    function checkLimit(uint256 _amount) private constant
        returns (bool) { 
        if (_amount < maxTranferLimit) //#B
            return true;
        return false;
    }

    function validateAccount(address _account) internal constant
        returns (bool) { 
        if (frozenAccount[_account] && tokenBalance[_account] > 0)  //#C
            return true;
        return false;
    }
   
    //...

    function freezeAccount(address target, bool freeze)
        onlyOwner public  { 
        frozenAccount[target] = freeze;  //#D
        FrozenAccount(target, freeze);
    }
}
#A these instructions alter the state variable coinBalance so transfer() cannot be declared constant
#B no instruction alters state variable so this function can be declared as constant
#C no instruction alters state variable so this function can be declared as constant
#D this instruction alters state variable frozenAccount so freezeAccount() cannot be declared constant.
