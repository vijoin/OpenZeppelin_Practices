/* 
Platzi Challenge #2
*Burnable and Pausable Token*

Create a ERC20 Token that allows to burn part of its supply and that can be pause in case of any found vulnerability
Both need to be made with "Owner" role
*/

// Test Contract creation, token name, token supply, token owner, transfer
// Test token Burn
// Test non-owner can't burn
// Test token pause
// Test token unpause
// Test non-owner can't pause
// Test non-owner can't unpause


const { expect } = require("chai");
const { ethers, BigNumber } = require("hardhat");

describe("ERC20 Challenge", () => {


    let owner;
    let ERC20Challenge;
    let erc20Challenge;

    beforeEach(async () => {
        [owner, addr1, ...addrs] = await ethers.getSigners();
        ERC20Challenge = await ethers.getContractFactory("ERC20Challenge");
        erc20Challenge = await ERC20Challenge.deploy();
        await erc20Challenge.deployed();
    });

    describe("Contract deployment", () => {

        // Test Contract creation, token name, 
        it("Constract was created successfully", async () => {
            expect(await erc20Challenge.name()).to.be.equal("Platzi Token");
            expect(await erc20Challenge.symbol()).to.be.equal("PLTZ");
        });


        //token supply
        it("Contract token supply", async () => {
            // totalSupply = await erc20Challenge.totalSupply();
            totalSupply = (await erc20Challenge.totalSupply()).toString();
            expect(totalSupply).to.be.equal("1000000000000000000000");
        });

        // token owner
        it("Deployer is the owner", async () => {
            expect(await erc20Challenge.owner()).to.be.equal(owner.address);
        });

        //transfer
        it("Transfer tokens to another account", async () => {
            amount = 1000000;
            await erc20Challenge.transfer(addr1.address, amount)
            expect(await erc20Challenge.balanceOf(addr1.address)).to.be.equal(amount);
        });



    });

    describe("Token Burn", () => {

        it("Burn token", async () => {
            newAmount = "999999999999999000000"
            
            await erc20Challenge.burn(1000000);
            
            totalSupply = (await erc20Challenge.totalSupply()).toString();
            expect(totalSupply).to.be.equal(newAmount);
            
            ownerBalance = (await erc20Challenge.balanceOf(owner.address)).toString();
            expect(ownerBalance).to.be.equal(newAmount);
            
        });
        
        it("non-owner can't burn", async () => {
            expect(
                erc20Challenge.connect(addr1).burn(1000000)
            ).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });


    });

    // describe("Contract Pause", () => {
    //     // Test token pause
    //     it("", () => {
            
    //     });
    //     // Test token unpause
    //     // Test non-owner can't pause
    //     // Test non-owner can't unpause

    // });

});




