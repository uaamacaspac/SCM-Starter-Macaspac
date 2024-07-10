// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    mapping(address => uint256) public remainingTimes;

    event IncreaseTime(address indexed from, uint256 amount);
    event ReduceTime(address indexed to, uint256 amount);
    event TransferTime(address indexed from, address indexed to, uint256 amount);

    constructor(uint256 remainingTime) payable {
        owner = payable(msg.sender);
        remainingTimes[msg.sender] = remainingTime;
    }

    function getRemainingTime(address _account) public view returns (uint256) {
        return remainingTimes[_account];
    }

    function increaseTime(uint256 _amount) public payable {
        remainingTimes[msg.sender] += _amount;
        emit IncreaseTime(msg.sender, _amount);
    }

    function reduceTime(uint256 _withdrawAmount) public {
        require(remainingTimes[msg.sender] >= _withdrawAmount, "Insufficient balance");

        remainingTimes[msg.sender] -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);

        emit ReduceTime(msg.sender, _withdrawAmount);
    }

    function transferTime(address _to, uint256 _amount) public {
        require(remainingTimes[msg.sender] >= _amount, "Insufficient balance");

        remainingTimes[msg.sender] -= _amount;
        remainingTimes[_to] += _amount;

        emit TransferTime(msg.sender, _to, _amount);
    }
}
