// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
    address public owner;
    uint public last_completed_migrations;

    constructor() {
        owner = msg.sender;
    }

    modifier restircted() {
        if(msg.sender == owner)
        _;
    }

    function setCompleted(uint completed) public restircted {
        last_completed_migrations = completed;
    }

    function upgrade(address new_address) public restircted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migrations);
    }
    
}