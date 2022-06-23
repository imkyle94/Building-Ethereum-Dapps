this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var simpleVotingContractInstance;

var voterRegisteredEvent;
var proposalsRegistrationStartedEvent;
var proposalsRegistrationEndedEvent;
var proposalRegisteredEvent;
var votingSessionStartedEvent;
var votingSessionEndedEvent;
var votedEvent;
var votesTalliedEvent;
var workflowStatusChangeEvent;

$.getJSON("./contracts/SimpleVoting.json", function(jsonSimpleVoting) {
	var SimpleVotingContractFactory = web3.eth.contract(jsonSimpleVoting.abi);
	var lastNetworkTimeIndex = Object.keys(jsonSimpleVoting.networks).length - 1;
	var lastNetworkTime = Object.keys(jsonSimpleVoting.networks)[lastNetworkTimeIndex];
	
	var instanceAddress = jsonSimpleVoting.networks[lastNetworkTime].address;

	simpleVotingContractInstance = SimpleVotingContractFactory.at(instanceAddress);	

	voterRegisteredEvent = simpleVotingContractInstance.VoterRegisteredEvent();	
	voterRegisteredEvent.watch(function(error, result) {
		if (!error)
			$("#voterRegistrationMessage").html('Voter successfully registered');
		else
			console.log(error);	
	});
	
	proposalsRegistrationStartedEvent = simpleVotingContractInstance.ProposalsRegistrationStartedEvent();	
	proposalsRegistrationStartedEvent.watch(function(error, result) {
		if (!error)
			$("#proposalsRegistrationMessage").html('The proposals registration session has started');
		else
			console.log(error);	
	});
	
	proposalsRegistrationEndedEvent = simpleVotingContractInstance.ProposalsRegistrationEndedEvent();	
	proposalsRegistrationEndedEvent.watch(function(error, result) {
		if (!error)
			$("#proposalsRegistrationMessage").html('The proposals registration session has ended');
		else
			console.log(error);	
	});
	
	proposalRegisteredEvent = simpleVotingContractInstance.ProposalRegisteredEvent();	
	proposalRegisteredEvent.watch(function(error, result) {
		if (!error)
		{
			$("#proposalRegistrationMessage").html('The proposal has been registered successfully');
			loadProposalsTable();
		}
		else
			console.log(error);	
	});
	
	votingSessionStartedEvent = simpleVotingContractInstance.VotingSessionStartedEvent();	
	votingSessionStartedEvent.watch(function(error, result) {
		if (!error)
			$("#votingSessionMessage").html('The voting session session has started');
		else
			console.log(error);	
	});
	
	votingSessionEndedEvent = simpleVotingContractInstance.VotingSessionEndedEvent();	
	votingSessionEndedEvent.watch(function(error, result) {
		if (!error)
			$("#votingSessionMessage").html('The voting session session has ended');
		else
			console.log(error);	
	});	
	
	votedEvent = simpleVotingContractInstance.VotedEvent();	
	votedEvent.watch(function(error, result) {
		if (!error)
			$("#voteConfirmationMessage").html('You have voted successfully');
		else
			console.log(error);	
	});		

	votesTalliedEvent = simpleVotingContractInstance.VotesTalliedEvent();	
	votesTalliedEvent.watch(function(error, result) {
		if (!error)
		{
			$("#votingTallyingMessage").html('Votes have been tallied');
			loadResultsTable();
		}
		else
			console.log(error);	
	});		
	
	workflowStatusChangeEvent = simpleVotingContractInstance.WorkflowStatusChangeEvent();	
	workflowStatusChangeEvent.watch(function(error, result) {
		if (!error)
			refreshWorkflowStatus();
		else
			console.log(error);	
	});
		
	refreshWorkflowStatus();
	loadProposalsTable();
	loadResultsTable();
});

function refreshWorkflowStatus()
{
	var workflowStatus = simpleVotingContractInstance.getWorkflowStatus().toString();
	var workflowStatusDescription;
	
	switch(workflowStatus)
	{
		case '0':
			workflowStatusDescription = "Registering Voters";		
			break;
		case '1':
			workflowStatusDescription = "Proposals registration Started";
			break;
		case '2':
			workflowStatusDescription = "Proposals registration Ended";
			break;
		case '3':
			workflowStatusDescription = "Voting session Started";
			break;
		case '4':
			workflowStatusDescription = "Voting session Ended";
			break;
		case '5':
			workflowStatusDescription = "Votes have been tallied";
			break;	
        default:
			workflowStatusDescription = "Unknown status";
	}
	
	$("#currentWorkflowStatusMessage").html(workflowStatusDescription);
}

function unlockAdmin()
{
	var adminAddress = $("#adminAddress").val();
	var adminPassword = $("#adminPassword").val();

	var result = web3.personal.unlockAccount(adminAddress, adminPassword, 180);//unlock for 3 minutes
	if (result)
		$("#adminMessage").html('The account has been unlocked');
	else
		$("#adminMessage").html('The account has NOT been unlocked');
}

function unlockVoter()
{
	var voterAddress = $("#voterAddress").val();
	var voterPassword = $("#voterPassword").val();

	var result = web3.personal.unlockAccount(voterAddress, voterPassword, 180);//unlock for 3 minutes
	if (result)
		$("#voterMessage").html('The account has been unlocked');
	else
		$("#voterMessage").html('The account has NOT been unlocked');
}

function registerVoter() {
	var adminAddress = $("#adminAddress").val();
	var voterToRegister = $("#voterAddress").val();
	
	var isAdministrator = simpleVotingContractInstance.isAdministrator(adminAddress);
	
	if (isAdministrator)
	{
		var isRegisteredVoter = simpleVotingContractInstance.isRegisteredVoter(voterToRegister);
		
		if (isRegisteredVoter)
			$("#voterRegistrationMessage").html('The voter is already registered');
		else
		{	
			var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
			
			if (workflowStatus > 0)
				$("#voterRegistrationMessage").html('Voters registration has already ended');
			else
			{	
				simpleVotingContractInstance.registerVoter(voterToRegister, {
										from:adminAddress, gas:200000},
										function(error, result){
											 if(error)							
												console.error(error);
										 });
			}
		}
	}
	else
		$("#voterRegistrationMessage").html('The given address does not corespond to the administrator');
}

function checkVoterRegistration() {
	var address = $("#address").val();	
	
	var isRegisteredVoter = simpleVotingContractInstance.isRegisteredVoter(address);
	
	if (isRegisteredVoter)
			$("#registrationVerificationMessage").html('This is a registered voter');
		 else
			$("#registrationVerificationMessage").html('This is NOT a registered voter');
}

function startProposalsRegistration() {
	var adminAddress = $("#adminAddress").val();
	
	var isAdministrator = simpleVotingContractInstance.isAdministrator(adminAddress);
	
	if (isAdministrator)
	{
		var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
		if (workflowStatus > 0)
			$("#proposalsRegistrationMessage").html('The proposals registration session has already been started');
		else
		{	
			simpleVotingContractInstance.startProposalsRegistration({
									from:adminAddress, gas:200000},
									function(error, result){
										 if(error)							
											console.error(error);
									 });
		}
	}
	else
		$("#proposalsRegistrationMessage").html('The given address does not correspond to the administrator');
}

function endProposalsRegistration() {
	var adminAddress = $("#adminAddress").val();
	
	var isAdministrator = simpleVotingContractInstance.isAdministrator(adminAddress);
	
	if (isAdministrator)
	{
		var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
		if (workflowStatus < 1)
			$("#proposalsRegistrationMessage").html('The proposals registration session has not started yet');
		else if (workflowStatus > 1)
			$("#proposalsRegistrationMessage").html('The proposals registration session has already been ended');
		else
		{	
			simpleVotingContractInstance.endProposalsRegistration({
									from:adminAddress, gas:200000},
									function(error, result){
										 if(error)							
											console.error(error);
									 });
		}
	}
	else
		$("#proposalsRegistrationMessage").html('The given address does not corespond to the administrator');
}

function startVotingSession() {
	var adminAddress = $("#adminAddress").val();
	
	var isAdministrator = simpleVotingContractInstance.isAdministrator(adminAddress);
	
	if (isAdministrator)
	{
		var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
		if (workflowStatus < 2)
			$("#votingSessionMessage").html('The proposals registration session has not ended yet');
		else if (workflowStatus > 2)
			$("#votingSessionMessage").html('The voting session has already been started');		
		else
		{	
			simpleVotingContractInstance.startVotingSession({
									from:adminAddress, gas:200000},
									function(error, result){
										 if(error)							
											console.error(error);
									 });
		}
	}
	else
		$("#votingSessionMessage").html('The given address does not corespond to the administrator');
}

function endVotingSession() {
	var adminAddress = $("#adminAddress").val();
	
	var isAdministrator = simpleVotingContractInstance.isAdministrator(adminAddress);
	
	if (isAdministrator)
	{
		var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
		if (workflowStatus < 3)
			$("#votingSessionMessage").html('The voting session has not started yet');
		else if (workflowStatus > 3)
			$("#votingSessionMessage").html('The voting session has already ended');		
		else
		{	
			simpleVotingContractInstance.endVotingSession({
									from:adminAddress, gas:200000},
									function(error, result){
										 if(error)							
											console.error(error);
									 });
		}
	}
	else
		$("#votingSessionMessage").html('The given address does not corespond to the administrator');
}

function tallyVotes() {
	var adminAddress = $("#adminAddress").val();
	
	var isAdministrator = simpleVotingContractInstance.isAdministrator(adminAddress);
	
	if (isAdministrator)
	{
		var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
		if (workflowStatus < 4)
			$("#votingTallyingMessage").html('The voting session has not ended yet');		
		else if (workflowStatus > 4)
			$("#votingTallyingMessage").html('Votes have already been tallied');
		else
		{	
			simpleVotingContractInstance.tallyVotes({
									from:adminAddress, gas:200000},
									function(error, result){
										 var newWorkflowStatus = simpleVotingContractInstance.getWorkflowStatus();
										 if(error)							
											console.error(error);
									 });
		}
	}
	else
		$("#votingTallyingMessage").html('The given address does not corespond to the administrator');
}

function registerProposal() {
	var voterAddress = $("#voterAddress").val();
	var proposalDescription = $("#proposalDescription").val();
	
	var isRegisteredVoter = simpleVotingContractInstance.isRegisteredVoter(voterAddress);
	if (!isRegisteredVoter)
	{
		$("#proposalRegistrationMessage").html('You are not a registered voter. You cannot register a proposal.');
		return;
	}
	
	var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
	if (workflowStatus < 1)
		$("#proposalRegistrationMessage").html('The proposal registration session has not started yet');
	else if (workflowStatus > 1)
		$("#proposalRegistrationMessage").html('The proposal registration session has already ended');	
	else
    {
		simpleVotingContractInstance.registerProposal(proposalDescription, {
								from:voterAddress, gas:200000},
								function(error, result){
									 if(error)							
										console.error(error);
								 });
	}
}

function loadProposalsTable() {

	var innerHtml = "<tr><td><b>Proposal Id</b></td><td><b>Description</b></td>";
	
	var proposalsNumber = simpleVotingContractInstance.getProposalsNumber();

	for (var i = 0; i < proposalsNumber; i++) {
		var description = simpleVotingContractInstance.getProposalDescription(i);
		innerHtml = innerHtml + "<tr><td>" + i + "</td><td>" + description + "</td></tr>";
	}
	
	$("#proposalsTable").html(innerHtml);
}

function vote() {
	var voterAddress = $("#voterAddress").val();
	var proposalId = $("#proposalId").val();
	
	var isRegisteredVoter = simpleVotingContractInstance.isRegisteredVoter(voterAddress);
	if (!isRegisteredVoter)
	{
		$("#voteConfirmationMessage").html('You are not a registered voter. You cannot vote.');
		return;
	}
	
	var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
	if (workflowStatus < 3)
		$("#voteConfirmationMessage").html('The voting session has not started yet');
	else if (workflowStatus > 3)
		$("#voteConfirmationMessage").html('The voting session has already ended');	
	else
    {
		var proposalsNumber = simpleVotingContractInstance.getProposalsNumber();
		if (proposalsNumber == 0)
		{
			$("#voteConfirmationMessage").html('The are no registered proposals. You cannot vote.');
			return;
		}
		
		if (parseInt(proposalId) >= proposalsNumber)
		{
			$("#voteConfirmationMessage").html('The specified proposalId does not exist.');
			return;
		}
		
		simpleVotingContractInstance.vote(proposalId, {
								from:voterAddress, gas:200000},
								function(error, result){									 
									 if(error)							
										$("#voteConfirmationMessage").html('An error was thrown:' + error);
								 });
	}	
}

function loadResultsTable() {

	var workflowStatus = simpleVotingContractInstance.getWorkflowStatus();
		
	if (workflowStatus == 5)
	{
		var winningProposalId = simpleVotingContractInstance.getWinningProposalId();
		var winningProposalDescription = simpleVotingContractInstance.getWinningProposalDescription();
		var winningProposalVoteCounts = simpleVotingContractInstance.getWinningProposaVoteCounts();

		var innerHtml = "<tr><td><b>Winning Proposal</b></td><td></td></tr>";
		var innerHtml = innerHtml + "<tr><td><b>Id:</b></td><td>" + winningProposalId +"</td></tr>";
		var innerHtml = innerHtml +  "<tr><td><b>Description:</b></td><td>" + winningProposalDescription  +"</td></tr>";
		var innerHtml = innerHtml +  "<tr><td><b>Votes count:</b></td><td>" + winningProposalVoteCounts  +"</td></tr>";	
		
		$("#resultsTable").html(innerHtml);
	}
}