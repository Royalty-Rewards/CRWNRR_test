pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import "./ConvertLib.sol";

contract CRWNRR_Token is MintableToken {
  // Public variables of the token
  string public name = "CRWN_Royalty_Rewards";
  string public symbol = "CRWNRR";
  uint8 public decimals = 18;
  // 18 decimals is the strongly suggested default, avoid changing it
  uint256 public totalSupply = 88888888;

}
