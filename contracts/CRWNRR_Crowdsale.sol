pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/RefundVault.sol";
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "./CRWNRR_Token.sol";

contract CRWNRR_Crowdsale is CappedCrowdsale{

  function CRWNRR_Crowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, uint256 _goal, uint256 _cap, address _wallet) public
    CappedCrowdsale(_cap)
    /* RefundableCrowdsale(_goal) */
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

  /* // @dev Buy tokes with guarantee
  function buyTokensWithGuarantee() public payable {
      require(validPurchase());

      uint256 weiAmount = msg.value;

      // calculate token amount to be created
      uint256 tokens = weiAmount.mul(getRate());
      tokens = tokens.div(REFUND_DIVISION_RATE);

      // update state
      weiRaised = weiRaised.add(weiAmount);

      token.issue(address(refundVault), tokens);

      refundVault.deposit.value(msg.value)(msg.sender, tokens);

      TokenPurchaseWithGuarantee(msg.sender, address(refundVault), weiAmount, tokens);
  }

  //@Override
  function finalization() internal onlyOwner {
      super.finalization();

      // granting bonuses for the pre crowdsale grantees:
      for (uint256 i = 0; i < presaleGranteesMapKeys.length; i++) {
          token.issue(presaleGranteesMapKeys[i], presaleGranteesMap[presaleGranteesMapKeys[i]]);
      }

      // Adding 60% of the total token supply (40% were generated during the crowdsale)
      // 40 * 2.5 = 100
      uint256 newTotalSupply = token.totalSupply().mul(250).div(100);

      // 10% of the total number of SRN tokens will be allocated to the team
      token.issue(walletTeam, newTotalSupply.mul(10).div(100));

      // 10% of the total number of SRN tokens will be allocated to OEM’s, Operating System implementation,
      // SDK developers and rebate to device and Sirin OS™ users
      token.issue(walletOEM, newTotalSupply.mul(10).div(100));

      // 5% of the total number of SRN tokens will be allocated to professional fees and Bounties
      token.issue(walletBounties, newTotalSupply.mul(5).div(100));

      // 35% of the total number of SRN tokens will be allocated to SIRIN LABS,
      // and as a reserve for the company to be used for future strategic plans for the created ecosystem
      token.issue(walletReserve, newTotalSupply.mul(35).div(100));

      // Re-enable transfers after the token sale.
      token.disableTransfers(false);

      // Re-enable destroy function after the token sale.
      token.setDestroyEnabled(true);

      // Enable ETH refunds and token claim.
      refundVault.enableRefunds();

      // transfer token ownership to crowdsale owner
      token.transferOwnership(owner);

      // transfer refundVault ownership to crowdsale owner
      refundVault.transferOwnership(owner);
  }

  function getRate() public view returns (uint256) {
    if (now < (startTime.add(24 hours))) {return 1000;}
    if (now < (startTime.add(2 days))) {return 950;}
    if (now < (startTime.add(3 days))) {return 900;}
    if (now < (startTime.add(4 days))) {return 855;}
    if (now < (startTime.add(5 days))) {return 810;}
    if (now < (startTime.add(6 days))) {return 770;}
    if (now < (startTime.add(7 days))) {return 730;}
    if (now < (startTime.add(8 days))) {return 690;}
    if (now < (startTime.add(9 days))) {return 650;}
    if (now < (startTime.add(10 days))) {return 615;}
    if (now < (startTime.add(11 days))) {return 580;}
    if (now < (startTime.add(12 days))) {return 550;}
    if (now < (startTime.add(13 days))) {return 525;}

    return rate;
} */

}
