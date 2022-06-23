pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleCoin.sol";

contract TestSimpleCoin {

  function testInitialBalanceUsingDeployedContract() public {
    SimpleCoin simpleCoin = SimpleCoin(DeployedAddresses.SimpleCoin());

    uint expected = 10000;

    Assert.equal(simpleCoin.coinBalance(tx.origin), expected, "Owner should have 10000 SimpleCoin initially");
  }
}