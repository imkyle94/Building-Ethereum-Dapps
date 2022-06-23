pragma solidity ^0.4.18;

import "./Listing5_8_SimpleCoin.sol";
contract SimpleCrowdsale {
   
    uint256 public startTime;
    uint256 public endTime;
    uint256 public tokenPrice;
    uint256 public investmentObjective;
    address public crowdsaleWallet;
   
    mapping (address => uint256) public investmentAmountOf;
    uint256 public investmentReceived;

    address public owner;
    
    SimpleCoin public simpleCoin;
   
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    event LogInvestment(address indexed investor, uint256 value);
    event LogTokenAssignment(address indexed investor, uint256 numTokens);
   
    constructor(uint256 _startTime, uint256 _endTime, 
        uint256 _tokenPrice, uint256 _investmentObjective,
        address _crowdsaleWallet) public
    {
        require(_startTime >= now);
        require(_endTime >= _startTime);
        require(_tokenPrice != 0);
        require(_investmentObjective != 0);
        require(_crowdsaleWallet != address(0));

        startTime = _startTime;
        endTime = _endTime;
        tokenPrice = _tokenPrice;
        investmentObjective = _investmentObjective;
        crowdsaleWallet = _crowdsaleWallet;
        
        
        simpleCoin = new SimpleCoin(0);	
    }
  
    function invest() public payable {
        require(isValidInvestment(msg.value));
        
        address investor = msg.sender;
        uint256 investment = msg.value;
        
        investmentAmountOf[investor] += investment;
        investmentReceived += investment;
        
        assignTokens(investor, investment);
        emit LogInvestment(investor, investment);
        crowdsaleWallet.transfer(investment);
    }
    
    function isValidInvestment(uint256 _investment) 
        internal constant returns (bool) {
        bool nonZeroContribution = _investment != 0;
        bool withinCrowdsalePeriod = now >= startTime && now <= endTime;
            
        return nonZeroContribution && withinCrowdsalePeriod;
    }
    
    function assignTokens(address _beneficiary, 
        uint256 _investment) internal {
        uint256 _numberOfTokens = calculateNumberOfTokens(_investment);
        
        simpleCoin.transfer(_beneficiary, _numberOfTokens);
    }
    
    //function updateTokenPrice() internal {
    //   
    //}
    
    function calculateNumberOfTokens(uint256 investment) 
        internal returns (uint256) {
        return investment / tokenPrice;
    }
   
    function finalize() onlyOwner public {
        //bool isCrowdsaleComplete = now > endTime;
        //bool investmentObjectiveMet = investmentReceived >= investmentObjective;
        
        //if (isCrowdsaleComplete && investmentObjectiveMet)
        //      simpleCoin.Release();
            
    }
    
    function refund() public {
        
    }
}