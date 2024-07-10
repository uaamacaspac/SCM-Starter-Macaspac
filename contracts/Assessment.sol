// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balances[msg.sender] = initBalance;
    }

    function getBalance(address _account) public view returns (uint256) {
        return balances[_account];
    }

    function deposit(uint256 _amount) public payable {
        balances[msg.sender] += _amount;
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(balances[msg.sender] >= _withdrawAmount, "Insufficient balance");

        balances[msg.sender] -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);

        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function transferFunds(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transferred(msg.sender, _to, _amount);
    }
}
