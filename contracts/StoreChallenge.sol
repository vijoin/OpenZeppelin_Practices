// SPDX-License-Identifier: GPL-3

// CHALLENGE
// 1. Use Remix Storage contract
// 2. Implement roles: ADMIN and WRITER
// 3. ADMIN can grant or remove WRITERs
// 4. Only WRITER can call store function
// 5. receive function can be called by anyone
// 6. Implement modifiers

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Storage is Ownable, AccessControl {

    uint256 number;
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

    function store(uint256 num) public onlyWriter {
        number = num;
    }

    function retrieve() public view returns (uint256){
        return number;
    }
}
