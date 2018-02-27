pragma solidity ^0.4.18;
/*
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract DiscreteMilestone is Ownable
{
  using SafeMath for uint256;
  using SafeMath for uint;

  enum Stages {
    INACTIVE,
    INPROGRESS,
    COMPLETE
  }
  uint256 public goal = 0;
  uint256 public amountSold = 0;
  Stages public stage;
  uint stageNum;
  address owner;

  modifier atStage(Stages _stage) {
    require(stage == _stage);
    _;
  }

  modifier transitionNext()
  {
      _;
      nextStage();
  }

  function nextStage() internal {
    stage = Stages(uint(stage) + 1);
  }

  function CRWNRR_SimpleMilestone() public
  {
    owner = msg.sender;
    stage = Stages.INACTIVE;
  }

  function setMilestone(uint256 inGoal)
    onlyOwner
    atStage(Stages.INACTIVE)
    transitionNext
    public returns(bool)
  {
    require(goal == 0);
    require(inGoal > 0);
    goal = inGoal;
    return true;
  }

  function getStage()
  onlyOwner
  public view returns(uint)
  {
    return uint(stage);
  }

  function getPercentageComplete()
  onlyOwner
  public view returns(uint)
  {
    return uint((amountSold / goal) * 100);
  }

  function checkMilestone(uint256 inAmount)
    onlyOwner
    atStage(Stages.INPROGRESS)
    public
  {
      amountSold = inAmount;
      require(goal > 0);
      if( amountSold >= goal)
      {
        MilestoneComplete();
        stage = Stages.COMPLETE;
      }
  }


} */
