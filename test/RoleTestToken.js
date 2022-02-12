const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControl Contract", function () {

  let RoleTestToken;
  let roleTestToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let MINTER_ROLE;

  beforeEach(async function () {
    RoleTestToken = await ethers.getContractFactory("RoleTestToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    roleTestToken = await RoleTestToken.deploy();
    MINTER_ROLE = await roleTestToken.MINTER_ROLE();
  
  });

  describe("Role Assignments", function () {
    it("ADMIN can add Role to an User", async function () {
      await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address)
      expect(
        await roleTestToken.hasRole(MINTER_ROLE, addr1.address)
        ).to.equal(true);
    });

    it("ADMIN can remove Role from an User", async function () {
      await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address)
      await roleTestToken.removeRoleFromAccount(MINTER_ROLE, addr1.address)
      expect(
        await roleTestToken.hasRole(MINTER_ROLE, addr1.address)
        ).to.equal(false);
    });

    it("non-ADMIN can't add Role from an User", async function () {
      expect(
        roleTestToken.connect(addr2).addRoleToAccount(MINTER_ROLE, addr1.address)
        ).to.be.reverted;
    });

    it("non-ADMIN can't remove Role from an User", async function () {
      await roleTestToken.addRoleToAccount(MINTER_ROLE, addr1.address);
      expect(
        roleTestToken.connect(addr2).removeRoleFromAccount(MINTER_ROLE, addr1.address)
        ).to.be.reverted;
    });

  });
});