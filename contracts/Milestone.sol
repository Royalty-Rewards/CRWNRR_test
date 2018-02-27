pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Milestone is Ownable{
  using SafeMath for uint256;
  using SafeMath for uint;

  enum Stages {
    INACTIVE,
    INPROGRESS,
    VERIFICATION,
    COMPLETE
  }

  enum MilestoneType {
     UNKNOWN,
     DISCRETE,
     CONSENSUS
  }

  enum VoteStates {
     UNKNOWN,
     NO,
     YES
  }

  struct shareholder
  {
    bool voted;
    VoteStates vote;
    uint256 weight; //determined by CRWN balance
  }

  uint256 public goal = 0;
  uint256 public amountSold = 0;

  Stages public stage;

  address owner;
  MilestoneType mType;
  /* uint256 totalShares = 0; //use to determine the total possible voting weight from the amoutn of CRWN each stakehold owns */

  address beneficiary;
  uint totalShareholders = 0;

  mapping(address => shareholder) mShareholders;
  mapping(address => bool) isShareholder;
  address[] mShareholderIndex;

  //Map bool values to VoteStates enum values
  mapping(bool => uint) boolToVote;
  //Used to record vote totals
  mapping(uint => uint256) voteTally;


  event Voted();
  event MilestoneComplete();
  event MilestoneRejected();

  modifier atStage(Stages _stage)
  {
    require(stage == _stage);
    _;
  }
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
  modifier isActiveShareholder(address inAddress)
  {
    require(isShareholder[inAddress]);
     _;
   }
  modifier isBeneficiary(address inAddress)
  {
    require(inAddress == beneficiary);
    _;
  }
  modifier isMilestoneType(MilestoneType _type)
  {
    require(mType == _type);
     _;
   }

  function nextStage() internal{ stage = Stages(uint(stage) + 1); }
  function prevStage() internal{ stage = Stages(uint(stage) - 1); }

  /**
   * @dev Constructor
   */
  function Milestone()
  {
      owner = msg.sender;
      stage = Stages.INACTIVE;
      mType = MilestoneType.UNKNOWN;
      beneficiary = owner;
  }

  function setConsensusMilestone(address[] _shareholders)
    onlyOwner
    isMilestoneType(MilestoneType.UNKNOWN)
    atStage(Stages.INACTIVE)
    public returns(bool)
  {
    mType = MilestoneType.CONSENSUS;
    boolToVote[true] = uint(VoteStates.YES);
    boolToVote[false] = uint(VoteStates.NO);
    voteTally[uint(VoteStates.NO)] = 0;
    voteTally[uint(VoteStates.YES)] = 0;
    for(uint i = 0; i < _shareholders.length; i++)
    {
      bool added = addShareholder(_shareholders[i]);
    }
    return true;
  }

  function setDiscreteMilestone(uint256 inGoal)
    onlyOwner
    isMilestoneType(MilestoneType.UNKNOWN)
    atStage(Stages.INACTIVE)
    public returns(bool)
  {
    require(goal == 0);
    require(inGoal > 0);
    mType = MilestoneType.DISCRETE;
    goal = inGoal;
    return true;
  }

  function addShareholder(address shareholderAddress)
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  public returns(bool)
  {
    require(shareholderAddress != address(0));
    require(shareholderAddress != address(owner));
    //make sure the beneficiary is not the shareholder..
    require(shareholderAddress != beneficiary);
    //make sure shareholder doesnt already exist..
    require(mShareholders[shareholderAddress].weight == 0);
    //add new shareholder to mShareholders
    mShareholderIndex.push(shareholderAddress);
    mShareholders[shareholderAddress] = shareholder(false, VoteStates.UNKNOWN, shareholderAddress.balance);
    isShareholder[shareholderAddress] = true;
    return true;
  }

  /**
   * @dev Function to begin progress on milestone
   */
  function beginProgress()
  onlyOwner
  atStage(Stages.INACTIVE)
  transitionNext
  public returns(bool)
  {
    if(mType == MilestoneType.CONSENSUS)
    {
      require(mShareholderIndex.length > 0);
      return true;
    }
    else if(mType == MilestoneType.DISCRETE)
    {
      require(goal > 0);
      return true;
    }
  }

  /**
   * @dev Function to reset progress on milestone (milestone was voted down)
   */
  function resetProgress()
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  atStage(Stages.VERIFICATION)
  transitionPrev
  public returns(bool)
  {
    require(mShareholderIndex.length > 0);
    return true;
  }

  /**
   * @dev Function to stop progress on milestone
   */
  function stopProgress()
  onlyOwner
  atStage(Stages.INPROGRESS)
  transitionPrev
  public returns(bool)
  {
    return true;
  }

  function startProgress()
  onlyOwner
  atStage(Stages.INACTIVE)
  public returns(bool)
  {
    stage = Stages.INPROGRESS;
    return true;
  }

  function getStage()
  onlyOwner
  public view returns(uint)
  {
    return uint(stage);
  }

  function getNumberOfShareholders()
  onlyOwner
  public view returns(uint)
  {
    return uint(mShareholderIndex.length);
  }

  function getShareholderWeight(address shareholderAddress)
  onlyOwner
  public view returns(uint256)
  {
    uint256 voterBalance = shareholderAddress.balance;
    uint256 totalShares = calculateTotalShares();
    uint256 weight = percent(voterBalance, totalShares, 2);
                           return weight;
  }

  function getProgress()
  onlyOwner
  public view returns(uint)
  {
    return getDiscretePercentageComplete();
  }

  function getDiscretePercentageComplete()
  onlyOwner
  isMilestoneType(MilestoneType.DISCRETE)
  public view returns(uint)
  {
    return uint((amountSold.div(goal)).mul(100));
  }

  function getConsensusPercentageComplete()
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  atStage(Stages.VERIFICATION)
  public view returns(uint256)
  {
    return voteTally[uint(VoteStates.YES)];
  }

  function checkMilestone(uint256 inAmount)
    onlyOwner
    isMilestoneType(MilestoneType.DISCRETE)
    atStage(Stages.INPROGRESS)
    public returns(bool)
  {
      amountSold = inAmount;
      require(goal > 0);
      bool ret = false;
      if( amountSold >= goal)
      {
        stage = Stages.COMPLETE;
        ret = true;
      }
      return ret;
  }

  /**
   * @dev Function to begin verification (voting) on milestone
   */
  function beginVerification()
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  atStage(Stages.INPROGRESS)
  transitionNext
  public returns(bool)
  {
    require(mShareholderIndex.length > 0);
    return true;
  }

  function vote(address shareholderAddress, bool voteValue)
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  isActiveShareholder(shareholderAddress)
  atStage(Stages.VERIFICATION)
  public returns(bool)
  {
      shareholder storage voter = mShareholders[shareholderAddress];
      if (voter.voted || voter.vote != VoteStates.UNKNOWN)
      {
        return false;
      }
      uint256 weight = getShareholderWeight(shareholderAddress);
      voter.voted = true;
      VoteStates voteType = VoteStates(boolToVote[voteValue]);
      voter.vote = voteType;
      voteTally[uint(voteType)] = voteTally[uint(voteType)].add(weight);
      Voted();
      if(voteTally[uint(voteType)] > 50)
      {
        if(voteType == VoteStates.YES)
        {
          MilestoneComplete();
          stage = Stages.COMPLETE;
        }
        /* else if(voteType == VoteStates.NO)
        {
          MilestoneRejected();
          stage = Stages.INPROGRESS;
        } */
      }
      return true;
  }

  function calculateTotalShares()
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  /* atStage(Stages.VERIFICATION) */
  public returns(uint256)
  {
    uint256 totalShares = 0;
    for (uint i = 0; i < mShareholderIndex.length; i++)
    {
        uint256 shareholderBalance = mShareholderIndex[i].balance;
        totalShares = totalShares.add(shareholderBalance);
    }
    return totalShares;
  }

  function percent(uint numerator, uint denominator, uint precision)
  pure returns(uint quotient) {

       // caution, check safe-to-multiply here
      uint _numerator  = numerator * 10 ** (precision+1);
      // with rounding of last digit
      uint _quotient =  ((_numerator / denominator) + 5) / 10;
      return ( _quotient);
  }
}
