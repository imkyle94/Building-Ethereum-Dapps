pragma solidity ^0.4.0; 
contract ReferenceTypesSample {
    uint[] storageArray;//#A
    
    function f(uint[] fArray) {} //#B
    function g(uint[] storage gArray) internal {} //#C
    function h(uint[] memory hArray) internal  {} //#D
}
