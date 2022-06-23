pragma solidity ^0.4.24;
import "./Listing6_4_Ownable.sol";
contract Pausable is Ownable { 
    bool public paused = false;//#A

    modifier whenNotPaused() {//#B
        require(!paused);
        _;
    }

    modifier whenPaused() {//#B
        require(paused);
        _;
    }

    function pause() onlyOwner whenNotPaused public {//#C
        paused = true;
    }

    function unpause() onlyOwner whenPaused public {//#C
        paused = false;
    }
}
/*
#A state variable holdinge paused state
#B modifier allowing function to run depending on paused state
#C functions changing paused state
*/