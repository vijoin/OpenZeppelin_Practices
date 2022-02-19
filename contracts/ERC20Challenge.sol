// SPDX-License-Identifier: GPL-3

/* 
Platzi Challenge #2
*Burnable and Pausable Token*

Create a ERC20 Token that allows to burn part of its supply and that can be pause in case of any found vulnerability
Both
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Challenge is ERC20Burnable, ERC20Pausable, Ownable {

    constructor() ERC20("Platzi Token", "PLTZ") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function burn(uint256 amount) onlyOwner() public override {
        super.burn(amount);
    }

    function pause() onlyOwner() public {
        _pause();
    }

     function unpause() onlyOwner() public {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
}