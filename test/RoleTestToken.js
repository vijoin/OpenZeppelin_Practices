const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControl Contract", function () {

  let RoleTestToken;
  let roleTestToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let MINTER_ROLE;
  let MODERATOR_ROLE;
  let USER_ROLE;

  beforeEach(async function () {
    RoleTestToken = await ethers.getContractFactory("RoleTestToken");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    roleTestToken = await RoleTestToken.deploy();
    MINTER_ROLE = await roleTestToken.MINTER_ROLE();
    MODERATOR_ROLE = await roleTestToken.MODERATOR_ROLE();
    USER_ROLE = await roleTestToken.USER_ROLE();
  });

  describe("Role Assignments", function () {
    it("ADMIN can add Role to an User", async function () {
      await roleTestToken.grantRole(MINTER_ROLE, addr1.address)
      expect(
        await roleTestToken.hasRole(MINTER_ROLE, addr1.address)
        ).to.equal(true);
    });

    it("ADMIN can remove Role from an User", async function () {
      await roleTestToken.grantRole(MINTER_ROLE, addr1.address)
      await roleTestToken.revokeRole(MINTER_ROLE, addr1.address)
      expect(
        await roleTestToken.hasRole(MINTER_ROLE, addr1.address)
        ).to.equal(false);
    });

    it("non-ADMIN can't add Role from an User", async function () {
      expect(
        roleTestToken.connect(addr2).grantRole(MINTER_ROLE, addr1.address)
      ).to.be.reverted;
        // ).to.be.revertedWith(
        //   `AccessControl: account ${addr2} is missing role ${DEFAULT_ADMIN_ROLE}`
        // );
    });

    it("non-ADMIN can't remove Role from an User", async function () {
      await roleTestToken.grantRole(MINTER_ROLE, addr1.address);
      expect(
        roleTestToken.connect(addr2).revokeRole(MINTER_ROLE, addr1.address)
        ).to.be.reverted;
    });
  });

  describe("Banning", function () {
    it("Moderator can ban an address", async function () {
      await roleTestToken.grantRole(MODERATOR_ROLE, addr1.address);
      await roleTestToken.connect(addr1).banUser(addr2.address);
      expect(
        await roleTestToken.bannedUsers(addr2.address)
      ).to.be.equal(true);
    });

    it("Moderator can unban an address", async function () {
      await roleTestToken.grantRole(MODERATOR_ROLE, addr1.address);
      await roleTestToken.connect(addr1).banUser(addr2.address);
      await roleTestToken.connect(addr1).unbanUser(addr2.address);
      expect(
        await roleTestToken.bannedUsers(addr2.address)
      ).to.be.equal(false);
    });

    it("non-Moderator can't ban an address", async function () {
      await expect(
        roleTestToken.connect(addr1).banUser(addr2.address))
        .to.be.reverted;
      // .to.be.revertedWith(
      //   `AccessControl: account ${addr1.address} is missing role ${MODERATOR_ROLE}`
      //   );
    });

    it("non-Moderator can't unban an address", async function () {
      await roleTestToken.grantRole(MODERATOR_ROLE, addr1.address);
      await roleTestToken.connect(addr1).banUser(addr2.address);
      // console.log("addr3", addr3.address);
      
      await expect(
        roleTestToken.connect(addr3).unbanUser(addr2.address))
        .to.be.reverted;
      // .to.be.revertedWith(
      //   `AccessControl: account ${addr3.address} is missing role ${MODERATOR_ROLE}`
      //   );
    });
  });

  describe("Send Message", function () {
    it("Address with DEFAULT_ADMIN_ROLE can send a message", async function () {
      expect(
        await roleTestToken.sendMessageToEveryone()
        ).to.be.equal("Hello Everyone!");
    });

    it("Address with MODERATOR_ROLE can send a message", async function () {
      await roleTestToken.grantRole(MODERATOR_ROLE, addr1.address);
      expect(
        await roleTestToken.connect(addr1).sendMessageToEveryone()
        ).to.be.equal("Hello Everyone!");
    });

    it("Address with MINTER_ROLE can send a message", async function () {
      await roleTestToken.grantRole(MINTER_ROLE, addr1.address);
      expect(
        await roleTestToken.connect(addr1).sendMessageToEveryone()
        ).to.be.equal("Hello Everyone!");
    });

    it("Address with USER_ROLE can send a message", async function () {
      await roleTestToken.grantRole(USER_ROLE, addr1.address);
      expect(
        await roleTestToken.connect(addr1).sendMessageToEveryone()
        ).to.be.equal("Hello Everyone!");
    });

    it("non-authorized address can't send a message", async function () {
      await expect(
        roleTestToken.connect(addr1).sendMessageToEveryone()
        ).to.be.revertedWith("This account isn't authorized to send a message!");
    });

    it("Banned address cannot send a message", async function () {
      await roleTestToken.grantRole(USER_ROLE, addr2.address);
      await roleTestToken.grantRole(MODERATOR_ROLE, addr1.address);
      await roleTestToken.connect(addr1).banUser(addr2.address);
      await expect(
        roleTestToken.connect(addr2).sendMessageToEveryone()
        ).to.be.revertedWith("This account is Banned");
    });
  });
});