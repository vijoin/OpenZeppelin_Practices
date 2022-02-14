// SPDX-License-Identifier: GPL-3

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract AccessControlChallenge is Ownable, AccessControl {

    bytes32 public constant WRITER_ROLE = keccak256("WRITER_ROLE");

    constructor () {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyWriter {
        require(
            hasRole(WRITER_ROLE, msg.sender),
            "Only account with WRITER_ROLE can execute this!"
            );
        _;
    }

    function storeText (string memory value) public view onlyWriter returns (string memory) {
        return value;
    }

    function receiveNumber (uint256 value) public pure returns (uint256) {
        return value;
    }

}
