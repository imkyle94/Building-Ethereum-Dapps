pragma solidity ^0.4.18;
import "./Listing5_8_SimpleCoin.sol";//#A
contract ReleasableSimpleCoin is SimpleCoin { //#B
    bool public released = false;//#C

    modifier isReleased() { //#D
        if(!released) {
            revert();
        }

        _;
    }

    constructor(uint256 _initialSupply) 
        SimpleCoin(_initialSupply) public {} //#E

    function release() onlyOwner public { //#F
        released = true;
    }

    function transfer(address _to, uint256 _amount) 
        isReleased public { //#G
        super.transfer(_to, _amount);//#H
    }

    function transferFrom(address _from, address _to, uint256 _amount) isReleased public returns (bool) {//#G
        super.transferFrom(_from, _to, _amount);//#H
    }  
}
/*
#A ReleasableSimpleCoin is now inherited from SimpleCoin
#B directive to reference the file where SimpleCoin is defined
#C flag determining whether the token is released
#D modifier encapsulating check on released flag
#E The ReleasableSimpleCoin constructor calls the base constructor to initialize the initialSupply state variable in SImpleCoin
#F new function to release the coin; it can be called only by the contract owner
#G this is overriding the original implementation; thanks to the can transfer modifier, this  can be called successfully only if the token has been released
#H the original SimpleCoin implementation is called through super
*/