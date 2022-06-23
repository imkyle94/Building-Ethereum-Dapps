CHAPTER 05 CODE SNIPPETS
------------------------

//6.1.1  - State variables

uint256 public startTime; //#A
uint256 public endTime; //#B
uint256 public weiTokenPrice; //#C
uint256 public weiInvestmentObjective; //#D
   
mapping (address => uint256) public investmentAmountOf; //#E
uint256 public investmentReceived; //#F
uint256 public investmentRefunded;//#G

bool public isFinalized; //#H
bool public isRefundingAllowed; //#I
address public owner; //#J
ReleasableSimpleCoin public crowdsaleToken; //#K
#A start time, in unix epoch, of the crowdsale funding stage
#B end time, in unix epoch, of the crowdsale funding stage
#C price of the token being sold
#D minimum investment objective, which defines if the crowdsale is successful
#D account holding the funding submitted by the investors
#E amount of ether received by each investor
#F total ether received from the investors
#G total ether refunded to the investors 
#H flag indicating if the contract has been finalized
#I flag indicating if refunding is allowed
#J account of the crowdsale contract owner
#K instance of the contract of the token being sold: we will use SimpleCoin for the moment


//6.1.2 - Constructor
constructor(uint256 _startTime, uint256 _endTime, 
	uint256 _weiTokenPrice, uint256 _etherInvestmentObjective) 
	payable public
{
    require(_startTime >= now);//#A
    require(_endTime >= _startTime);//#A
    require(_weiTokenPrice != 0);//#A
    require(_etherInvestmentObjective != 0);//#A
	
    startTime = _startTime;//#B
    endTime = _endTime;//#B
    weiTokenPrice = _weiTokenPrice;//#B
    weiInvestmentObjective = _etherInvestmentObjective;//#B

    crowdsaleToken = new SimpleCoin(0);//#C	
	isFinalized = false;
	isRefundingAllowed = false;
    owner = msg.sender;//#D
}
#A Validate input configurations
#B Set input configurations into state variables
#C Instantiate the contract of the token being sold in the crowdsale
#D Set the contract owner, as seen in SimpleCoin



//6.1.3 - invest()
event LogInvestment(address indexed investor, uint256 value);
event LogTokenAssignment(address indexed investor, uint256 numTokens);

function invest() public payable { //#A
    require(isValidInvestment(msg.value)); //#B
	
    address investor = msg.sender;
    uint256 investment = msg.value;
	
    investmentAmountOf[investor] += investment; //#C
    investmentReceived += investment; //#C 
	
    assignTokens(investor, investment);//#D
    emit LogInvestment(investor, investment);//#E
}

function isValidInvestment(uint256 _investment) 
    internal view returns (bool) { //#F
    bool nonZeroInvestment = _investment != 0;//#G
    bool withinCrowdsalePeriod = now >= startTime && now <= endTime; //#H
		
    return nonZeroInvestment && withinCrowdsalePeriod;
}

function assignTokens(address _beneficiary, 
    uint256 _investment) internal {

    uint256 _numberOfTokens = calculateNumberOfTokens(_investment); //#I
	
    crowdsaleToken.mint(_beneficiary, _numberOfTokens); //#J
}

function calculateNumberOfTokens(uint256 _investment) 
    internal returns (uint256) {
    return _investment / weiTokenPrice; //#K
}
#A The invest() function is declared as payable to accept ether
#B Check if the investment is valid
#C Take a record the investment contributed by each investor and of the total investment
#D Convert the ether investment into crowdsale tokens
#E Log the investment event
#F Validate investment
#G Check this is a meaningful investment
#H Check this is taking place during the crowdsale funding stage
#I Calculate the number of tokens corresponding to the investment
#J Generate the tokens in the investor account
#K Formula to calculate the number of tokens

///////////////
//6.1.6	Implementing finalize() - take 2

in variables:
ReleasableSimpleCoin public crowdsaleToken;

in constructor:
crowdsaleToken = new ReleasableSimpleCoin(0);

then functions:

function finalize() onlyOwner public { //#A
	if (isFinalized) revert();//#B

	bool isCrowdsaleComplete = now > endTime; //#C
	bool investmentObjectiveMet = investmentReceived >= weiInvestmentObjective;//#C
		
	if (isCrowdsaleComplete)
	{     
		if (investmentObjectiveMet)
			crowdsaleToken.release();//#D
		else 
			isRefundingAllowed = true;//#E

		isFinalized = true;
	}               
}
#A finalize() can only be called by the crowdsale contract owner
#B do not allow to call finalize() on a finalized contract
#C conditions determining if a crowdsale has been successful 
#D release crowdsale tokens, so that investors can use them
#E the funding objective has not been met, so allow investors to get refunded


//6.1.7

event Refund(address investor, uint256 value);

function refund() public {
	if (!isRefundingAllowed) revert();//#A

	address investor = msg.sender;
	uint256 investment = investmentAmountOf[investor];
	if (investment == 0) revert();//#B
	investmentAmountOf[investor] = 0;//#C
	investmentRefunded += investment;
	emit Refund(msg.sender, investment);

	if (!investor.send(investment)) revert();//#D
}
//#A Only allow refunding is this has been allowed at the crowdsale finalization
//#B Only allow refunding if the investor has contributed a meaningful amount
//#C keep a record of all refunds
//#D Transfer ether back to the investor and handle possible transfer error

//6.1.8 

pragma solidity ^0.4.24;
contract Ownable {
    address public owner;//#A

    function Ownable() public {
        owner = msg.sender;//#B
    }

    modifier onlyOwner() {
        require(msg.sender == owner);//#C
        _;
    }
}
#A The address of the contract owner is kept in a state variable
#B The contract owner is assigned at construction
#C Check if the function caller using this modifier is the owner

----
Constructor input for SimpleCrowdsale in ReMix:
2003526559, 2003526559, 2000000000000000, 15000, "0x1"

----


6.2.1 Token based pricing logic

function calculateNumberOfTokens(uint256 investment) 
    internal returns (uint256) {
    return investment / weiTokenPrice; //#A
}
#A weiTokenPrice is fixed, because it is not modified during the crowdsale

----
struct Tranche {
    uint256 weiHighLimit;//#A
    uint256 weiTokenPrice;//#B
}
#A higher funding limite of the tranche
#B token price associated with the tranche
----   
mapping(uint256 => Tranche) public trancheStructure;
---    
trancheStructure[0] = Tranche(3000 ether, 0.002 ether);//#A
trancheStructure[1] = Tranche(10000 ether, 0.003 ether);//#A
trancheStructure[2] = Tranche(15000 ether, 0.004 ether);//#A
trancheStructure[3] = Tranche(1000000000 ether, 0.005 ether);//#A
#A tranche limits and token price expressed in ether
----

uint256 currentTrancheLevel;
--
currentTrancheLevel = 0;
---

6.2.2 EXTRACTING PAUSABILITY FUNCTIONALITY

contract ReleasableSimpleToken is SimpleCoin, Pausable { //#A
   …
}
#A ReleasableSimpleToken is inherited both from SimpleCoin and from Pausable
---