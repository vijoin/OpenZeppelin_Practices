const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ("Challenge #1 Access Control", function () {

    let owner;
    let addr1;
    let addr2;
    let Storage;
    let storage;
    let WRITER_ROLE;

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        Storage = await ethers.getContractFactory("Storage")
        storage = await Storage.deploy()
        await storage.deployed();

        WRITER_ROLE = await storage.WRITER_ROLE();
    });

    describe("Contract deployment", function () {

        it("Contract was Created successfully", async function () {
            expect(
                await storage.owner()
            ).to.be.equal(owner.address);
        });

    });

    describe("Roles", function () {

        it("ADMIN can add Writers", async function () {
            await storage.grantRole(WRITER_ROLE, addr1.address);
            expect(
                await storage.hasRole(WRITER_ROLE, addr1.address)
            ).to.be.equal(true);
        });

        it("non-ADMIN can't add Writers", function () {
            expect(
                storage.connect(addr1).grantRole(WRITER_ROLE, addr2.address)
            ).to.be.reverted;
        });

    });

    describe("Operations", function () {

        it("store function call with Writer role", async function () {
            await storage.grantRole(WRITER_ROLE, addr1.address);
            await storage.connect(addr1).store(99);
            expect(
                await storage.retrieve()
            ).to.be.equal(99);
        });

        it("reverted transaction when non-Writer calls store function", function () {
            expect(
                storage.connect(addr1).store(98)
            ).to.be.revertedWith(
                "Only account with WRITER_ROLE can execute this!"
            );
        });
    });

});









