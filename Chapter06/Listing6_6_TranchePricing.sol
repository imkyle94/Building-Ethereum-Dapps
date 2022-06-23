function calculateNumberOfTokens(uint256 investment) 
    internal returns (uint256) {
    updateCurrentTrancheAndPrice();//#A
    return investment / weiTokenPrice; 
}

function updateCurrentTrancheAndPrice() //#B
    internal {
    uint256 i = currentTrancheLevel;
  
    while(trancheStructure[i].weiHighLimit < investmentReceived) //#C
        ++i;
	  
    currentTrancheLevel = i;

    weiTokenPrice = trancheStructure[currentTrancheLevel].weiTokenPrice; //#D
}
/*
#A this is the only change to calculateNumberOfTokens()
#B this new function updates the current tranche and consequently also the current token price 
#C tranches are tested to identify where investmentReceived falls
#D weiTokenPrice is updated with the value from the current trancheTranche-based pricing crowdsale contract
*/
