pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Heritable.sol";

contract CRWNRR_Wallet is Heritable
{
  /* enum ACCOUNT_TYPE {ETHER, CRWNRR}
  mapping (uint256 => mapping address) internal CRWNRRAccounts;
  mapping (uint256 => mapping address) internal EtherAccounts; */
  event Sent(address indexed payee, uint256 amount, uint256 balance);
  event Received(address indexed payer, uint256 amount, uint256 balance);

  function CRWNRR_Wallet(uint256 _heartbeatTimeout) Heritable(_heartbeatTimeout) public {}
  /**
   * @dev wallet can receive funds.
   */
  function receiveFrom() public payable {
    Received(msg.sender, msg.value, this.balance);
  }

  /* function addAccount(ACCOUNT_TYPE type, address accountAddress, uint256 derivedKey) public onlyOwner
  {
    if(type == ETHER)
    {

    }
    else if(type == CRWNRR)
    {

    }
  } */
  /**
   * @dev wallet can send funds
   */
  function sendTo(address payee, uint256 amount) public onlyOwner
  {
    require(payee != 0 && payee != address(this));
    require(amount > 0);
    payee.transfer(amount);
    Sent(payee, amount, this.balance);
  }
}
