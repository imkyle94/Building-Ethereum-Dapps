pragma solidity ^0.4.24;
contract Ownable {
    address public owner;//#A

    constructor() public {
        owner = msg.sender;//#B
    }

    modifier onlyOwner() {
        require(msg.sender == owner);//#C
        _;
    }
}
/*
#A The address of the contract owner is kept in a state variable
#B The contract owner is assigned at construction
#C Check if the function caller using this modifier is the owner
*/
