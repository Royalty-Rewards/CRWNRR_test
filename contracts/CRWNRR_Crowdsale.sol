pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/RefundableCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "./CRWNRR_Token.sol";

contract CRWNRR_Crowdsale is CappedCrowdsale, RefundableCrowdsale {

  function CRWNRR_Crowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, uint256 _goal, uint256 _cap, address _wallet) public
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    Crowdsale(_startTime, _endTime, _rate, _wallet)
  {
    //As goal needs to be met for a successful crowdsale
    //the value needs to less or equal than a cap which is limit for accepted funds
    require(_goal <= _cap);
  }

  function createTokenContract() internal returns (MintableToken)
  {
    return new CRWNRR_Token();
  }
/*
  function finalization() internal
  {
    super.finalization();
  } */

}
