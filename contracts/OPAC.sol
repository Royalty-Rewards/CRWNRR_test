pragma solidity ^0.4.18;


import "./CRWNRR_Token.sol";
import "./CRWNRR_Crowdsale.sol";
import "./CRWNRR_SimpleMilestone.sol";
import "./Wallet.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/payment/SplitPayment.sol";

contract CRWNRR_OPAC is Ownable {

  //OPAC escrow wallet
  Wallet mEscrowWallet;
  //Used to disburse funding to OPAC owners
  SplitPayment paymentSplitter;

  mapping(address => Wallet) m_ownerIndex;

  struct RoyaltyRewards {
    CRWNRR_SimpleMilestone milestone;
    mapping(address => Wallet) m_ownerIndex;
    uint8 vote;
    address delegate;
  }

    // Defines a new type with two fields.
  struct Funder {
      address addr;
      uint amount;
  }

  struct Campaign {
      address beneficiary;
      uint fundingGoal;
      uint numFunders;
      uint amount;
      mapping (uint => Funder) funders;
  }

  uint numCampaigns;
  mapping (uint => Campaign) campaigns;

  function newCampaign(address beneficiary, uint goal) public returns (uint campaignID) {
      campaignID = numCampaigns++; // campaignID is return variable
      // Creates new struct and saves in storage. We leave out the mapping type.
      campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0);
  }

  function contribute(uint campaignID) public payable {
      Campaign storage c = campaigns[campaignID];
      // Creates a new temporary memory struct, initialised with the given values
      // and copies it over to storage.
      // Note that you can also use Funder(msg.sender, msg.value) to initialise.
      c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
      c.amount += msg.value;
  }

  function checkGoalReached(uint campaignID) public returns (bool reached) {
      Campaign storage c = campaigns[campaignID];
      if (c.amount < c.fundingGoal)
          return false;
      uint amount = c.amount;
      c.amount = 0;
      c.beneficiary.transfer(amount);
      return true;
  }

  function addDiscreteMilestone()
  {

  }

  function addConsensusMilestone()
  {

  }

  function getNumberOfMilestones()
  {

  }

  function getCurrentMilestone()
  {

  }

  function totalMilestonesComplete()
  {

  }

  function getCurrentMilestoneProgress()
  {

  }

  function getNumberOfStakeholders()
  {

  }

  function getTotalAmountFunded()
  {

  }

  function getTotalFundsReleased()
  {

  }

  function addStakeholder()
  {

  }

  function createCrowdsale()
  {

  }

  function buyTokens()
  {

  }

  function voteOnMilestone()
  {

  }

}
