pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import "./ConvertLib.sol";

interface tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public; }

contract CRWNRR_Token is StandardToken, Ownable {
  // Public variables of the token
  string public name = "CRWN_Royalty_Rewards";
  string public symbol = "CRWNRR";
  uint8 public decimals = 18;
  // 18 decimals is the strongly suggested default, avoid changing it
  uint256 public totalSupply = 88,888,888;

  function CRWNRR_Token() public {
    balances[msg.sender] = totalSupply;
  }
}
