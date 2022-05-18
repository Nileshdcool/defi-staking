// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Teather public teather;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance; 

    mapping(address => bool) public hasStaked; 

    mapping(address => bool) public isStaking; 


    constructor(RWD _rwd, Teather _teather){
      rwd = _rwd;
      teather = _teather;
      owner = msg.sender;
    }

function depositTokens(uint _amount) public{
  
  require(_amount>0,'amount cannot be zero');
  teather.transferFrom(msg.sender,address(this), _amount);
  stakingBalance[msg.sender]=stakingBalance[msg.sender]+_amount;
  if(!hasStaked[msg.sender]){
    stakers.push(msg.sender);
  }
  isStaking[msg.sender]=true;
  hasStaked[msg.sender]=true;
}

// unstake tokens 

function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    // reqquire the amount to be greater than zero
    require(balance > 0, "staking balance cant be less than zero");
    // tranmsfer the tokens to the specified contract address from our bank
    teather.transfer(msg.sender, balance);

    // reset stakin g balance 
    stakingBalance[msg.sender] = 0;

    // update staking status
    isStaking[msg.sender] = false;
}


function issueTokens() public {
  // require the owner to issue the tokens onlyu
  require(msg.sender == owner, "caller must be owner");
  for (uint index = 0; index < stakers.length; index++) {
    address recipient = stakers[index];
    uint balance = stakingBalance[recipient] / 9; // /9 to create percentage increment
    if(balance > 0)
    {
      rwd.transfer(recipient, balance);
    }
    
  }
}

  

}