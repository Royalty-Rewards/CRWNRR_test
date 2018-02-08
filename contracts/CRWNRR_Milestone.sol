pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
//import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CRWNRR_Milestone {
  using SafeMath for uint256;
  bool public milestoneMet = false;
  uint256 goal;
  uint256 reward;
  address beneficiary;
  address marketSource;

//  event Released(uint256 amount);

  /* function CRWNRR_Milestone(address _beneficiary, address _marketSource, uint256 _goal, uint256 _reward) public
  {
    marketSource = _marketSource;
    beneficiary = _beneficiary;
    goal = _goal;
    reward = _reward;
  }

  function checkMilestoneStatus(address _marketSource, uint256 currentAmount) public
  {
    require(_marketSource == marketSource);
    require(currentAmount >= goal);
    if(currentAmount >= goal)
    {
      milestoneMet = true;
      Released(reward);
    }
  } */

}
