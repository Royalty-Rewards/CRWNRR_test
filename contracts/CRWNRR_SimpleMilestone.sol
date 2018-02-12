pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CRWNRR_SimpleMilestone is Ownable
{
  using SafeMath for uint256;

  enum status {
    undefined,
    incomplete,
    complete
  }
  uint256 public goal = 0;
  status public state = status.undefined;
  address owner;

  event MilestoneComplete();

  function CRWNRR_SimpleMilestone() public{owner = msg.sender;}

  function setMilestone(uint256 inGoal) onlyOwner public
  {
    if(state == status.undefined && goal == 0){
      goal = inGoal;
      state = status.incomplete;
    }
  }

  function checkMilestone(uint256 currentAmount) onlyOwner public returns(bool)
  {
    bool milestoneCompleted = false;
    if(state == status.incomplete)
    {
    if(currentAmount >= goal)
    {
      state = status.complete;
      MilestoneComplete();
      milestoneCompleted = true;
    }
  }
    return milestoneCompleted;
  }
}
