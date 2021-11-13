// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract WavePortal is Ownable {
    uint256 public totalWaves;
    uint256 public winningOdds;
    uint256 public prizeAmount;
    mapping(address => uint) public waveCountByUser;
    mapping(address => uint256) public lastWavedAt;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Wave[] waves;

    constructor() payable {
        // give the user a 30% chance of winning unless we decide to change the dificulty 
        winningOdds = 30;
        prizeAmount = 0.0001 ether;
        totalWaves = 0;
    }

    // Owner only functions 
    function setWinningOdds(uint256 odds) public onlyOwner {
        require(odds <= 100);
        winningOdds = odds;
    }

    function setPrizeAmount(uint256 winnings) public onlyOwner {
        require(winnings <= address(this).balance, 
            "Can't change prize to more money than the contract has.");
        prizeAmount = winnings;
    }

    // Public functions
    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        waveCountByUser[msg.sender]++;
        waves.push(Wave(msg.sender, _message, block.timestamp));

        if (didPlayerWin()) {
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
    
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getWavesByUser(address waver) public view returns (uint256) {
        console.log("User has waved %d times", waveCountByUser[waver]);
        return waveCountByUser[waver];
    }

    // Private functions
    function didPlayerWin() private view returns (bool) {
        uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));

        uint playersOdds = randomHash % 100;

        console.log('Player odds = %d', playersOdds);
        // if the player drew a number less then the winning odds lets gift em
        return (playersOdds <= winningOdds);
    }
}