pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MultiSig.sol";

contract ConsensusMilestone is Ownable{

  enum Stages {
    INACTIVE,
    INPROGRESS,
    VERIFICATION,
    COMPLETE
  }

  enum VoteStates {
     UNKNOWN,
     NO,
     YES
  }

  struct Stakeholder
  {
    bool voted;
    VoteStates vote;
    address stakeholderAddress;
    uint256 weight; //determined by CRWN balance
  }

  uint256 totalStakeholderWeight = 0; //use to determine the total possible voting weight from the amoutn of CRWN each stakehold owns
  uint totalYesWeight = 0;
  uint totalNoWeight = 0;
  address beneficiary;
  uint totalStakeholders = 0;
  mapping(address => Stakeholder) mStakeholders;
  mapping(uint => address) mStakeholdersIndexMap;

  event MilestoneComplete();
  event MilestoneFailed();
  event VoteRecorded(address, bool);
  event StakeholderAdded(address newOwner);
  event StakeholderRemoved(address oldOwner);


  modifier transitionNext()
  {
      _;
      nextStage();
  }

  modifier transitionPrev()
  {
      _;
      prevStage();
  }

  function nextStage() internal
  {
    stage = Stages(uint(stage) + 1);
  }

  function prevStage() internal
  {
    stage = Stages(uint(stage) - 1);
  }

  modifier isStakeHolder(address inAddress)
  {
    require(mStakeholders[inAddress] != 0);
    _;
  }

  modifier isBeneficiary(address inAddress)
  {
    require(inAddress == beneficiary);
    _;
  }

  /**
   * @dev Constructor
   */
  function ConsensusMilestone(address _beneficiary)
  {
      owner = msg.sender;
      stage = Stages.INACTIVE;
      beneficiary = _beneficiary;
  }

  /**
   * @dev Function to begin progress on milestone
   */
  function beginProgress(potentialBeneficiary)
  onlyOwner
  isBeneficiary(potentialBeneficiary)
  atStage(Stages.INACTIVE)
  transitionNext
  public returns(bool)
  {
    require(mStakeholders.length > 0);
    return true;
  }

  /**
   * @dev Function to reset progress on milestone (milestone was voted down)
   */
  function resetProgress(potentialBeneficiary)
  onlyOwner
  isBeneficiary(potentialBeneficiary)
  atStage(Stages.VERIFICATION)
  transitionPrev
  public returns(bool)
  {
    require(mStakeholders.length > 0);
    return true;
  }

  /**
   * @dev Function to stop progress on milestone
   */
  function stopProgress(potentialBeneficiary)
  onlyOwner
  isBeneficiary(potentialBeneficiary)
  atStage(Stages.INPROGRESS)
  transitionPrev
  public returns(bool)
  {
    require(mStakeholders.length > 0);
    return true;
  }

  /**
   * @dev Function to begin verification (voting) on milestone
   */
  function beginVerification(address potentialBeneficiary)
  onlyOwner
  atStage(Stages.INPROGRESS)
  isBeneficiary(potentialBeneficiary)
  transitionNext
  public returns(bool)
  {
    require(mStakeholders.length > 0);
    return true;
  }

  function addStakeholder(address stakeHolderAddress)
  onlyOwner
  public returns(bool)
  {
    //make sure the beneficiary is not the stakeholder..
    require(stakeHolderAddress != beneficiary);
    //make sure stakeholder doesnt already exist..
    require(mStakeholders[stakeHolderAddress] == 0);
    //add new stakeholder to mStakeholders
    totalStakeholders += 1;
    mStakeholdersIndexMap[totalStakeholders] = stakeHolderAddress;
    mStakeholders[stakeholderAddress] = Stakeholder(false, VoteStates.NONE, stakeHolderAddress, stakeHolderAddress.balance);
    return true;
  }

  /// Delegate your vote to the voter $(to).
  function delegate(address to) public
  {
      Voter storage sender = voters[msg.sender]; // assigns reference
      if (sender.voted) return;
      while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender)
          to = voters[to].delegate;
      if (to == msg.sender) return;
      sender.voted = true;
      sender.delegate = to;
      Voter storage delegateTo = voters[to];
      if (delegateTo.voted)
          proposals[delegateTo.vote].voteCount += sender.weight;
      else
          delegateTo.weight += sender.weight;
  }

  function vote(address potentialVoterAddress, bool voteValue)
  onlyOwner
  isStakeHolder(stakeholder)
  atStage(Stages.VERIFICATION)
  public returns(bool)
  {
      require(mStakeholders[stakeHolderAddress] != 0);
      Stakeholder storage voter = voters[potentialVoterAddress];
      if (voter.voted || voter.vote != VoteStates.NONE)
      {
        return false;
      }
      uint256 voterBalance = voter.stakeHolderAddress.balance;
      uint256 totalStake = calculateTotalStake();
      uint weight = uint((voterBalance / totalStake) * 100);
      sender.voted = true;
      sender.vote = voteValue;
      if(voteValue == true)
      {
        totalYesWeight += weight;
        if(totalYesWeight > 50)
        {
          MilestoneComplete();
        }
      }
      else
      {
        totalNoWeight += weight;
        if(totalNoWeight > 50)
        {
          MilestoneFailed();
        }
      }
      VoteRecorded(potentialVoterAddress, voteValue);
      return true;
      /* proposals[toProposal].voteCount += sender.weight; */
  }

  function calculateTotalStake()
  onlyOwner
  isStakeHolder(stakeholder)
  atStage(Stages.VERIFICATION)
  internal returns(uint256)
  {
    uint256 totalStake = 0;
    for (uint i = 1; i < totalStakeholders + 1; i++)
    {
        totalStake += m_ownerIndex[mStakeholdersIndexMap[i]].stakeholderAddress.balance;
    }
    return totalStake;
  }

function winningProposal() public constant returns (uint8 _winningProposal) {
    uint256 winningVoteCount = 0;
    for (uint8 prop = 0; prop < proposals.length; prop++)
        if (proposals[prop].voteCount > winningVoteCount) {
            winningVoteCount = proposals[prop].voteCount;
            _winningProposal = prop;
        }
}



}
