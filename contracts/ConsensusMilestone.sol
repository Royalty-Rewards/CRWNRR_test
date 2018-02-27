 pragma solidity ^0.4.18;
/*
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MultiSig.sol";

contract ConsensusMilestone is Ownable{
  using SafeMath for uint256;
  using SafeMath for uint;

  enum Stages {
    INACTIVE,
    INPROGRESS,
    VERIFICATION,
    COMPLETE
  }

  enum VoteStates {
     UNKNOWN,
     NO,
     YES
  }

  struct shareholder
  {
    bool voted;
    VoteStates vote;
    address shareholderAddress;
    uint256 weight; //determined by CRWN balance
  }

  uint256 totalShares = 0; //use to determine the total possible voting weight from the amoutn of CRWN each stakehold owns
  uint totalYesWeight = 0;
  uint totalNoWeight = 0;
  address beneficiary;
  uint totalshareholders = 0;
  mapping(address => shareholder) mShareholders;
  mapping(uint => address) mShareholdersIndexMap;
  mapping(uint => uint) voteTally;

  event MilestoneComplete();
  event MilestoneFailed();
  event VoteRecorded(address, bool);
  event shareholderAdded(address newOwner);

  modifier transitionNext(){ _; nextStage(); }
  modifier transitionPrev(){ _; prevStage(); }
  modifier isShareholder(address inAddress){ require(mShareholders[inAddress] != 0); _; }
  modifier isBeneficiary(address inAddress){ require(inAddress == beneficiary);  _; }

  function nextStage() internal{ stage = Stages(uint(stage) + 1); }
  function prevStage() internal{ stage = Stages(uint(stage) - 1); }

  function ConsensusMilestone(address _beneficiary)
  {
      owner = msg.sender;
      stage = Stages.INACTIVE;
      beneficiary = _beneficiary;
      voteTally[uint(VoteStates.NO)] = 0;
      voteTally[uint(VoteStates.YES)] = 0;
  }

  function beginProgress(potentialBeneficiary)
  onlyOwner
  isBeneficiary(potentialBeneficiary)
  atStage(Stages.INACTIVE)
  transitionNext
  public returns(bool)
  {
    require(mShareholders.length > 0);
    return true;
  }

  function resetProgress(potentialBeneficiary)
  onlyOwner
  isBeneficiary(potentialBeneficiary)
  atStage(Stages.VERIFICATION)
  transitionPrev
  public returns(bool)
  {
    require(mShareholders.length > 0);
    return true;
  }

  function stopProgress(potentialBeneficiary)
  onlyOwner
  isBeneficiary(potentialBeneficiary)
  atStage(Stages.INPROGRESS)
  transitionPrev
  public returns(bool)
  {
    require(mShareholders.length > 0);
    return true;
  }

  function beginVerification(address potentialBeneficiary)
  onlyOwner
  atStage(Stages.INPROGRESS)
  isBeneficiary(potentialBeneficiary)
  transitionNext
  public returns(bool)
  {
    require(mShareholders.length > 0);
    return true;
  }

  function addshareholder(address shareholderAddress)
  onlyOwner
  public returns(bool)
  {
    //make sure the beneficiary is not the shareholder..
    require(shareholderAddress != beneficiary);
    //make sure shareholder doesnt already exist..
    require(mShareholders[shareholderAddress] == 0);
    //add new shareholder to mShareholders
    totalshareholders += 1;
    mShareholdersIndexMap[totalshareholders] = shareholderAddress;
    mShareholders[shareholderAddress] = shareholder(false, VoteStates.NONE, shareholderAddress, shareholderAddress.balance);
    return true;
  }

  function vote(address potentialVoterAddress, bool voteValue)
  onlyOwner
  isShareholder(shareholder)
  atStage(Stages.VERIFICATION)
  public returns(bool)
  {
      require(mShareholders[shareholderAddress] != 0);
      shareholder storage voter = voters[potentialVoterAddress];
      if (voter.voted || voter.vote != VoteStates.NONE)
      {
        return false;
      }
      uint256 voterBalance = voter.shareholderAddress.balance;
      uint256 totalShares = calculateTotalShares();
      uint weight = uint((voterBalance.div(totalShares)).mul(100));
      sender.voted = true;
      VoteRecorded(potentialVoterAddress, voteValue);
      if(voteValue == true)
      {
        sender.vote = VoteStates.YES;
        voteTally[uint(VoteStates.YES)].add(weight);
        if(totalYesWeight > 50)
        {
          MilestoneComplete();
          stage = Stages.COMPLETE;
        }
      }
      else
      {
        sender.vote = VoteStates.NO;
        voteTally[uint(VoteStates.NO)].add(weight);
        if(totalNoWeight > 50)
        {
          MilestoneFailed();
          stage = Stages.INPROGRESS;
        }
      }
      return true;
  }

  function calculateTotalShares()
  onlyOwner
  isShareholder(shareholder)
  atStage(Stages.VERIFICATION)
  internal returns(uint256)
  {
    uint256 totalStake = 0;
    for (uint i = 1; i < totalshareholders + 1; i++)
    {
        uint256 shareholderBalance = m_ownerIndex[mShareholdersIndexMap[i]].shareholderAddress.balance;
        totalStake.add(shareholderBalance);
    }
    return totalStake;
  }
} */
