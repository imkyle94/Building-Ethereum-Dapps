pragma solidity ^0.4.24;
import "./Listing6_4_Ownable.sol";
contract Destructible is Ownable {

   constructor() payable public { } 

   function destroyAndSend(address _recipient) onlyOwner public {
      selfdestruct(_recipient);//#A   
   }
}
//#A Destroy the contract after having transferred ether to a safe specified account