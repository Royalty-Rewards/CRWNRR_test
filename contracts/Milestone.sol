pragma solidity ^0.4.18;

import "./zeppelin/math/SafeMath.sol";
import "./zeppelin/ownership/Ownable.sol";

//TODO: Inherit from zeppelin RBAC (role based access)
//It will allow for easily keeping track of roles associated with milestone
contract Milestone is Ownable{
  using SafeMath for uint256;
  using SafeMath for uint;
  // =================================================================================================================
  //                                      State Variables, and Custom Types
  // =================================================================================================================
  //possible milestone stages
  enum Stages {
    INACTIVE,
    INPROGRESS,
    VERIFICATION,
    COMPLETE
  }
  //possible milestone type
  enum MilestoneType {
     UNKNOWN,
     DISCRETE,
     CONSENSUS,
     DEVELOPMENT
  }

  //shareholder vote states
  enum VoteStates {
     UNKNOWN,
     NO,
     YES
  }

  //custom type to hold some basic info about shareholder voting
  struct shareholder
  {
    bool voted;
    VoteStates vote;
    uint256 weight; //determined by CRWN balance
  }

  //used in discrete milestones
  uint256 public goal = 0;
  uint256 public amountSold = 0;
  uint256 public milestoneBaseAmount = 0;
  //state variable to keep track of milestone state machine
  Stages public stage;
  //other information about this milestone
  string milestoneName;
  MilestoneType mType;
  //owner of this contract instance
  address owner;

  //state variables to keep track of shareholders
  mapping(address => shareholder) mShareholders;
  mapping(address => bool) isShareholder;
  address[] mShareholderIndex;

  //Map bool values to VoteStates enum values
  mapping(bool => uint) boolToVote;
  //Used to record vote totals
  mapping(uint => uint256) voteTally;
  // =================================================================================================================
  //                                      Events
  // =================================================================================================================
  //milestone events
  event Voted(address voter);
  //executed when milestone is met
  event MilestoneComplete(string milestoneName);
  //executes when a milestone is voted down
  event MilestoneRejected(string milestoneName);
  // =================================================================================================================
  //                                      Modifiers
  // =================================================================================================================
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

  modifier isMilestoneType(MilestoneType _type)
  {
    require(mType == _type);
     _;
   }
   // =================================================================================================================
   //                                      Functions //TODO: Seperate into public/internal, etc...
   // =================================================================================================================
  function nextStage() internal{ stage = Stages(uint(stage) + 1); }
  function prevStage() internal{ stage = Stages(uint(stage) - 1); }

  /**
   * @dev Constructor
   */
  function Milestone(string _milestoneName)
  {
      owner = msg.sender;
      stage = Stages.INACTIVE;
      mType = MilestoneType.UNKNOWN;
      milestoneName = _milestoneName;
  }
  /**
   * @dev function to set the milestone type as consensus
   * @param _shareholders array of shareholder addresses.
   * @return A boolean that indicates if the operation was successful.
   */
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
  /**
   * @dev function to set the milestone type as discrete
   * @param inGoal discrete sales goal.
   * @return A boolean that indicates if the operation was successful.
   */
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
  /**
   * @dev function add shareholder to consensus milestone
   * @param shareholderAddress address of new shareholder.
   * @return A boolean that indicates if the operation was successful.
   */
  function addShareholder(address shareholderAddress)
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  public returns(bool)
  {
    require(shareholderAddress != address(0));
    require(shareholderAddress != address(owner));
    //make sure shareholder doesnt already exist..
    require(mShareholders[shareholderAddress].weight == 0);
    //add new shareholder to mShareholders
    mShareholderIndex.push(shareholderAddress);
    mShareholders[shareholderAddress] = shareholder(false, VoteStates.UNKNOWN, shareholderAddress.balance);
    isShareholder[shareholderAddress] = true;
    return true;
  }
  /**
   * @dev function to begin progress on milestone
   * @return A boolean that indicates if the operation was successful.
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
   * @dev function to reset progress on milestone (if milestone completion was rejected)
   * @return A boolean that indicates if the operation was successful.
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
   * @dev function to stop progress on milestone (sets state to INACTIVE)
   * @return A boolean that indicates if the operation was successful.
   */
  function stopProgress()
  onlyOwner
  atStage(Stages.INPROGRESS)
  transitionPrev
  public returns(bool)
  {
    return true;
  }
  /**
   * @dev function to begin progress on milestone
   * @return A boolean that indicates if the operation was successful.
   */
  function startProgress()
  onlyOwner
  atStage(Stages.INACTIVE)
  public returns(bool)
  {
    stage = Stages.INPROGRESS;
    return true;
  }
  /**
   * @dev function to get current milestone state
   * @return uint representing a value from Stages enum
   */
  function getStage()
  onlyOwner
  public view returns(uint)
  {
    return uint(stage);
  }
  /**
   * @dev function to get current milestone state
   * @return uint equal to number of shareholders
   */
  function getNumberOfShareholders()
  onlyOwner
  public view returns(uint)
  {
    return uint(mShareholderIndex.length);
  }
  /**
   * @dev function to get the voting weight of a shareholder
   * @param shareholderAddress address of shareholder.
   * @return uint256 equal to the voting weight as a percentage.
   */
  function getShareholderWeight(address shareholderAddress)
  onlyOwner
  public view returns(uint256)
  {
    uint256 voterBalance = shareholderAddress.balance;
    uint256 totalShares = calculateTotalShares();
    uint256 weight = percent(voterBalance, totalShares, 2);
    return weight;
  }
  /**
   * @dev function to get milestone percentage complete
   * @return uint256 percentage complete
   */
  function getProgress()
  onlyOwner
  public view returns(uint256)
  {
    if(mType == MilestoneType(MilestoneType.DISCRETE))
    {
      return getDiscretePercentageComplete();
    }
    else if(mType == MilestoneType(MilestoneType.CONSENSUS))
    {
      return getConsensusPercentageComplete();
    }
  }
  /**
   * @dev internal function to get percentage complete of discrete milestone
   * @return percentage complete
   */
  function getDiscretePercentageComplete()
  onlyOwner
  isMilestoneType(MilestoneType.DISCRETE)
  internal view returns(uint256)
  {
    uint256 milestoneRange = goal.sub(milestoneBaseAmount);
    uint256 totalSold = amountSold.sub(milestoneBaseAmount);
    uint256 percentComplete = percent(totalSold, milestoneRange, 2);
    return percentComplete;
  }
  /**
   * @dev internal function to get current percentage of "YES" votes
   * @return percentage complete
   */
  function getConsensusPercentageComplete()
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
  atStage(Stages.VERIFICATION)
  internal view returns(uint256)
  {
    return voteTally[uint(VoteStates.YES)];
  }
  /**
   * @dev function to report and check sales updates for discrete milestones (checkMilestone is a bad name)
   * @return boolean that indicates if the operation was successful.
   */
  function checkMilestone(uint256 inAmount)
    onlyOwner
    isMilestoneType(MilestoneType.DISCRETE)
    atStage(Stages.INPROGRESS)
    public returns(bool)
  {
      if(milestoneBaseAmount == 0)
      {
        //so that we can calculate progress based on a starting sales point
        milestoneBaseAmount = inAmount;
      }
      amountSold = inAmount;
      require(goal > 0);
      bool ret = false;
      if( amountSold >= goal)
      {
        stage = Stages.COMPLETE;
        MilestoneComplete(milestoneName);
        ret = true;
      }
      return ret;
  }
  /**
   * @dev function for OPAC owner to enable shareholder voting on milestone
   * @return boolean that indicates if the operation was successful.
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
  /**
   * @dev function for OPAC owner to enable shareholder voting on milestone
   * @param shareholderAddress address of shareholder that is voting.
   * @param voteValue boolean indicating a yes or no vote
   * @return boolean that indicates if the operation was successful.
   */
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
      Voted(shareholderAddress);
      if(voteTally[uint(voteType)] > 50)
      {
        if(voteType == VoteStates.YES)
        {
          MilestoneComplete(milestoneName);
          stage = Stages.COMPLETE;
        }
        else if(voteType == VoteStates.NO)
        {
          MilestoneRejected(milestoneName);
          stage = Stages.INPROGRESS;
        }
      }
      return true;
  }
  /**
   * @dev function to get total number of shares owned by milestone shareholders
   * @return uint256 equal to total shares
   */
  function calculateTotalShares()
  onlyOwner
  isMilestoneType(MilestoneType.CONSENSUS)
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
  /**
   * @dev utility function to calculate percentages using uint256 types
   * @return uint256 percentage value
   */
  function percent(uint numerator, uint denominator, uint precision)
  pure returns(uint quotient) {

       // caution, check safe-to-multiply here
      uint _numerator  = numerator * 10 ** (precision+1);
      // with rounding of last digit
      uint _quotient =  ((_numerator / denominator) + 5) / 10;
      return ( _quotient);
  }
}
