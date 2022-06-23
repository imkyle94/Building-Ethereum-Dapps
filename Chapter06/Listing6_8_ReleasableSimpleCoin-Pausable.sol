pragma solidity ^0.4.24;
import "./Listing5_8_SimpleCoin.sol";
contract ReleasableSimpleCoin is SimpleCoin { 
    ...//#A
    
    bool public paused = false;//#B

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() onlyOwner whenNotPaused public {//#C
        paused = true;
    }

    function unpause() onlyOwner whenPaused public {//#C
        paused = false;
    }

    ...//#A

    function transfer(address _to, uint256 _amount) 
        canTransfer whenNotPaused public {//#D
        super.transfer(_to, _amount); 
    }

    function transferFrom(address _from, address _to, uint256 _amount) 
        canTransfer whenNotPaused public returns (bool) {//#D
        super.transferFrom(_from, _to, _amount); 
    }  
}
/*
#A same code as before
#B flag holding the paused state
#C modifiers holding the paused state
#D the whenNotPaused modifier guarantees a transfer can only take place when the token contract has not been paused
*/