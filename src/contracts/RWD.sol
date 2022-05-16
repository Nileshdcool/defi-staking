// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RWD {
   string public name = 'Reward Token';
   string public symbol = 'RWD';
   uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
   uint8 public decimals = 18;

   event Tranfer(address indexed _from, address indexed _to, uint _value);
   event Approve(address indexed _owner, address indexed _spender, uint _value);

   mapping(address => uint256) public balanceOf;
   mapping(address => mapping(address => uint256)) public allowance;

   constructor() {
      balanceOf[msg.sender] = totalSupply;
   }

   function transfer(address _to, uint _value) public returns(bool success)
   {
      require(balanceOf[msg.sender] >= _value);
      balanceOf[msg.sender] -= _value;
      balanceOf[_to] += _value;
      emit Tranfer(msg.sender, _to, _value);
      return true;
   }

   function approve(address _spender, uint _value) public returns(bool success) {
      allowance[msg.sender][_spender] = _value;
      emit Approve(msg.sender, _spender, _value);
      return true;
   }

   function transferFrom(address _from, address _to, uint _value) public returns(bool) {
      require(_value <= balanceOf[_from]);
      require(_value <= allowance[_from][msg.sender]);
      // add the balance for transfer from 
      balanceOf[_to] += _value;
      allowance[msg.sender][_from] -= _value;
      emit Tranfer(_from, _to, _value);
      return true;
   }
}
