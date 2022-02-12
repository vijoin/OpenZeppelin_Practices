// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RoleTestToken is ERC20, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    mapping (address => bool) public bannedUsers;

    constructor() ERC20("Role Test Token", "RTT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint (address to, uint256 amount) onlyRole(MINTER_ROLE) public {
        _mint(to, amount);

    }

    function banUser(address account) public onlyRole(MODERATOR_ROLE){
        bannedUsers[account] = true;
    }

    function unbanUser(address account) public onlyRole(MODERATOR_ROLE){
        if (bannedUsers[account]) delete bannedUsers[account];
    }

    function sendMessageToEveryone() public view returns (string memory){
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(MODERATOR_ROLE, msg.sender) || hasRole(MINTER_ROLE, msg.sender) || hasRole(USER_ROLE, msg.sender),
            "This account isn't authorized to send a message!"
            );
        require(!bannedUsers[msg.sender], "This account is Banned");
        return "Hello Everyone!";
    }

}