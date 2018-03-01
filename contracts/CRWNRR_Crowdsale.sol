pragma solidity ^0.4.18;

/* import "./zeppelin/crowdsale/validation/CappedCrowdsale.sol"; */
import "./zeppelin/crowdsale/price/IncreasingPriceCrowdsale.sol";
import "./zeppelin/crowdsale/distribution/FinalizableCrowdsale.sol";
import "./zeppelin/crowdsale/distribution/PostDeliveryCrowdsale.sol";
import "./CRWNRR_Token.sol";

contract CRWNRR_Crowdsale is PostDeliveryCrowdsale, FinalizableCrowdsale, IncreasingPriceCrowdsale{

  function CRWNRR_Crowdsale(
  uint256 _openingTime,
  uint256 _closingTime,
  address _wallet,  //wallet is an instance of payment splitter (which contains refund vault, dev wallets, etc..)
  CRWNRR_Token _token,
  uint256 _initialRate,
  uint256 _finalRate
  )
  public
  Crowdsale(_initialRate, _wallet, _token)
  TimedCrowdsale(_openingTime, _closingTime)
  IncreasingPriceCrowdsale(_initialRate, _finalRate)
  {
      require(_token != address(0));
      require(_wallet != address(0));
  }
  /**
   * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid conditions are not met.
   * @param _beneficiary Address performing the token purchase
   * @param _weiAmount Value in wei involved in the purchase
   */
  function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    super._postValidatePurchase(_beneficiary, _weiAmount);
    // optional override
  }
  /**
   * @dev Override for extensions that require an internal state to check for validity (current user contributions, etc.)
   * @param _beneficiary Address receiving the tokens
   * @param _weiAmount Value in wei involved in the purchase
   */
  function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
    super._updatePurchasingState(_beneficiary, _weiAmount);
    //This is where we check if the _beneficiary should be receiving a special rate (such as pre-ICO discount, etc)
    //e.g. if the beneficiary was listed to get a 20% discount for pre-ico purchase, we could add the extra tokens here

  }

  /**
   * @dev Can be overridden to add finalization logic. The overriding function
   * should call super.finalization() to ensure the chain of finalization is
   * executed entirely.
   */
  function finalization() internal {
    super.finalization();
    //If this was a refundable crowdsale, this is where we would unlock the refund vault

    //This will call _deliverTokens which will deliver the tokens to their respective owners...
    withdrawTokens();
  }


}
