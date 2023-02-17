//SPDX-License-Identifier: MIT


/**SMART CONTRACT DESCRIPTION
 * The Smart contract creates a security token called "Grandida Token".
 * The token serves as a represntative asset for the shares/stakes in Grandida LLC.
 * There's a fixed total supply which cannot be altered.
 * The entire supply is assigned to the address that deploys the contract. 
 */

//THE SMART CONTRACT ALGORITHM

/**
 * Solidity files have to start with this pragma.
 * This will be used by the Solidity compiler to validate its version.
 * It also tells other Smart contracts how to handle it.
 *  */ 

pragma solidity ^0.8.9;

//This is the main building block for smart contracts.
//Instantiate the name of the contract.
//Instantiate the contract
contract grandidaToken {

//Create a wallet structure for the contract
    struct wallet {

        //Define some state variables

        uint256 balance;
        uint256 accummulatedInterest;
        uint256 interestBalance;
        uint256 purchaseTime;
        bool calculatedInterest;
        bool assertableInterest;
        bool accountFrozen;
    

    }

//Initialize mappings within the smartcontract
//Make the type public; meaning its accessible to everybody.
    mapping (address => bool) public approvedInvestors;
    mapping (address => bool) public RegulatoryAgencies;
    mapping (address => wallet) public accounts;
    address payable Grandida;
    uint256 public monthlyInterestRate;
    string public name = "Grandida Token";
    string public symbol = "GRD";

//Total amount of grandida security token in supply
    uint256 public availableTokens;
    uint256 totalAmountOfTokenSupply;

    uint32 MONTH_IN_SECONDS = 60;

//Initialise the constructor function which only executed once when the contract is first deployed.
//Like constructor in many class-based programming languages, 
//these functions often initialize state variables to their specified values.

    constructor() payable {
        Grandida = payable(msg.sender);
    }

//Define events that will be emitted
    event NewTokensMinted (uint32 _amount);
    event assertInterestAmount(address _account, uint256 _value);

//Instantiate the smart contracts functions

//add accepted investors after verification
function addToApprovedlist (address newAddress) public onlyGrandida {
    approvedInvestors[newAddress] = true;
}

//Investor approved and added into regulatory agencies list
function addToRegs (address newlyRegulated) public onlyGrandida {
    RegulatoryAgencies[newlyRegulated] = true;
}

//mine new tokens for new investment/funding round
function mintNewTokens (uint32 amountMinted) public onlyGrandida {
    accounts[Grandida].balance += amountMinted * 100000;
    availableTokens = accounts[Grandida].balance;
    totalAmountOfTokenSupply += amountMinted * 100000;
    emit NewTokensMinted (amountMinted);

}

//Declare function for interest rate placement on the Grandida platform
function placeinterestRate (uint256 _interestRate) public onlyGrandida {
    monthlyInterestRate = _interestRate;
}

//Declare Token purchase function
function purchaseToken() public payable notFrozen {
    require(approvedInvestors[msg.sender] == true, "Sorry!, Your address is not accepted, kindly complete your KYC/AML verification with Grandida before attempting to make purchase."); 
    uint256 tokenstoPurchase = msg.value / (10 ** 18); //this is only needed for the payment of Ether
    tokenstoPurchase = tokenstoPurchase * 100000;

    //if theres enough balance in the Grandida account and funding is > 0
    require(tokenstoPurchase > 0, "Soory!, No funds has been sent to purchase tokens with." );
    require(accounts[Grandida].balance >= tokenstoPurchase, "Oops!, You do not have enough tokens available for purchase, kindly re-check the amount of token available and decrease your purchase amount.");
    Grandida.transfer(msg.value);

    //Transfer Grandida security token from Grandida account to the investor's
    accounts[msg.sender].balance += tokenstoPurchase;
    accounts[Grandida].balance -= tokenstoPurchase;
    availableTokens = accounts[Grandida].balance;

    //Update purchase time and interest amount
    accounts[msg.sender].purchaseTime = block.timestamp;
    accounts[msg.sender].calculatedInterest = false;
    accounts[msg.sender].assertableInterest = false; 


}

function confirmIfAssertable() public notFrozen returns (bool Assertable) {
    bool isAssertable = (block.timestamp > (accounts[msg.sender].purchaseTime + MONTH_IN_SECONDS));
    
    if (isAssertable){
        accounts[msg.sender].assertableInterest = true;
    }
    return isAssertable;

}

//Declare function that calculates interest owed based on account balance
function calculateInterestOwed() public notFrozen{
    require(!accounts[msg.sender].calculatedInterest);
    accounts[msg.sender].accummulatedInterest += accounts[msg.sender].balance * (monthlyInterestRate);
    accounts[msg.sender].calculatedInterest = true;

} 

//declare a function that acquires interest from accummulated interest into the balance of interest
function assertInterestamount() public notFrozen{
    require(accounts[msg.sender].accummulatedInterest > 0, "Sorry!, Your accummulated interest amount is currently 0, kindly click calculateAccummulatedInterest to find out how much you have accummulated.");
    require(accounts[msg.sender].assertableInterest, "The interest holding period has not passed, kindly wait until your assertable interest date to assert owed interest.");
    accounts[msg.sender].interestBalance += accounts[msg.sender].accummulatedInterest;
    accounts[msg.sender].accummulatedInterest = 0;
    accounts[msg.sender].assertableInterest = false;
    accounts[msg.sender].purchaseTime = block.timestamp; //resets interest holding period
}

function withdrawInterest() public notFrozen{
    require(accounts[msg.sender].interestBalance > 0, "The amount of your interest balance is currently 0.");
    emit assertInterestAmount(msg.sender, accounts[msg.sender].interestBalance);
    accounts[msg.sender].interestBalance = 0;
}

function transfer(address receiver, uint32 value) public notFrozen{
    require(approvedInvestors[receiver] == true, "Sorry!, Receiver's address is not accepted, kindly have them complete KYC/AML verifiction with Grandida before attempting transfer." );
    require(accounts[receiver].accountFrozen == false, "Sorry!, Recipient's assets have been frozen by a regulatory agency, they cannot receive tokens.");
    accounts[receiver].balance += value;
    accounts[msg.sender].balance -= value;

    //calculate the amount of interest accummulated to send with token
    uint256 interestChange = (value * accounts[msg.sender].accummulatedInterest) / accounts[msg.sender].balance;

    //lets transfer the interest owed
    accounts[receiver].accummulatedInterest += interestChange;
    accounts[msg.sender].accummulatedInterest -= interestChange;

    //updaate newAssertableDate with later assertable date out of receiver and sender
    uint256 newAssertableDate;
    if (accounts[receiver].purchaseTime > accounts[msg.sender].purchaseTime){
        newAssertableDate = accounts[receiver].purchaseTime;
    }
    else{
        newAssertableDate = accounts[msg.sender].purchaseTime;
    }
    accounts[receiver].purchaseTime = newAssertableDate;


}

//Declare the freezeAssets function
function freezsAssets(address frozenAccount) public {
    require(approvedInvestors[msg.sender] == true, "Sorry!, Sender's address is not a regulatory agency.");
    accounts[frozenAccount].accountFrozen = true;
}

//Declare the UnfreezeAssets function
function UnfreezeAssets(address frozenAccount) public {
    require(approvedInvestors[msg.sender] == true, "Sorry!, Sender's address is not a regulatory agency.");
    accounts[frozenAccount].accountFrozen = false;
}

//Declare a forceTokenTransfer function
function forceTokenTransfer(address crook, address receiver, uint32 value) public {
    require(approvedInvestors[msg.sender] == true, "Sorry!, Sender's address is not a regulatory agency.");
    accounts[receiver].balance += value;
    accounts[crook].balance -= value;

     //calculate the amount of interest accummulated to send with token, if its not yet asserted.
    uint256 interestChange = (value * accounts[crook].accummulatedInterest / accounts[crook].balance);

     //lets transfer the interest owed
    accounts[receiver].accummulatedInterest += interestChange;
    accounts[crook].accummulatedInterest -= interestChange;

//updaate newAssertableDate with later assertable date out of receiver and sender
    uint256 newAssertableDate;
    if (accounts[receiver].purchaseTime > accounts[crook].purchaseTime){
        newAssertableDate = accounts[receiver].purchaseTime;
    }
    else{
        newAssertableDate = accounts[crook].purchaseTime;
    }
    accounts[receiver].purchaseTime = newAssertableDate;

     

}

//Declare MODIFIERS

modifier onlyGrandida() {
    require(msg.sender == Grandida, "Sorry!, Sender is not authorized for this action.");
    _;
}

modifier notFrozen() {
    require(accounts[msg.sender].accountFrozen == false, "Sorry!, Your assets have been frozen by a regulatory agency.");
    _;
}




}