// SPDX-License-Identifier: GPL-3

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract AccessControlChallenge is Ownable, AccessControl {

    bytes32 public constant WRITER_ROLE = keccak256("WRITER_ROLE");

    constructor () {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

}