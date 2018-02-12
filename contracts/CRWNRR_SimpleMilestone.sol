pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CRWNRR_SimpleMilestone is Ownable{
  using SafeMath for uint256;
  enum milestoneState {
    incomplete,
    complete
  };

  uint256 goal;
  uint256 reward;
  address beneficiary;
  address owner;
  milestoneState state;

  event MilestoneComplete(uint256 reward);

  function CRWNRR_SimpleMilestone(address _beneficiary, address _owner, uint256 _goal, uint256 _reward) public
  {
    owner = owner;
    beneficiary = _beneficiary;
    goal = _goal;
    reward = _reward;
    state = inomplete;
  }

  function checkMilestone(uint256 currentAmount) public onlyOwner
  returns(bool)
  {
    require(currentAmount >= goal);
    bool ret = false;
    if(currentAmount >= goal)
    {
      ret = true;
      uint256 milestoneReward = reward;
      //zero out the wards amount so that it cannot be released again
      reward = 0;
      milestoneState = complete;
      MilestoneComplete(milestoneReward);
    }
    return ret;
  }

}
