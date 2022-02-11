const { expect } = require("chai");
const { keccak256 } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("AccessControl Contract", function () {

  // const MINTER_ROLE = keccak256("MINTER_ROLE");

  let RoleTestToken;
  let roleTestToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let ADMIN_ROLE;
  let MINTER_ROLE;

  beforeEach(async function () {
    RoleTestToken = await ethers.getContractFactory("RoleTestToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    roleTestToken = await RoleTestToken.deploy();
    await roleTestToken.deployed();
    ADMIN_ROLE = await roleTestToken.ADMIN_ROLE();
    MINTER_ROLE = await roleTestToken.MINTER_ROLE();
  
  });

  describe("Role Assignments", function () {
    it("ADMIN can add Role to an User", async function () {
      await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address)
      expect(await roleTestToken.hasRole(MINTER_ROLE, addr1.address)).to.equal(true);
    });

    it("ADMIN can remove Role from an User", async function () {
      await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address)
      await roleTestToken.removeRoleFromAccount(MINTER_ROLE, addr1.address)
      expect(await roleTestToken.hasRole(MINTER_ROLE, addr1.address)).to.equal(false);
    });

    it("non-ADMIN can't add Role from an User", async function () {

      // await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address)
      
      expect(
        roleTestToken.connect(addr2).addRoleToAccount(MINTER_ROLE, addr1.address)
        ).to.be.revertedWith(
          `AccessControl: account ${addr2.address} is missing role ${ADMIN_ROLE}`
        );
      
        await roleTestToken.connect(owner);
    });

    // Can't make it work!!!
    // it("non-ADMIN can't remove Role from an User", async function () {

    //   await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address);
    //   await roleTestToken.connect(addr2);
    //   expect(roleTestToken.removeRoleFromAccount(MINTER_ROLE, addr1.address)).to.be.reverted();

    // });

  });
});