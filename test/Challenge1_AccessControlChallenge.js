const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ("Challenge #1 Access Control", function () {

    let owner;
    let addr1;
    let addr2;
    let AccessControlChallenge;
    let accessControlChallenge;
    let WRITER_ROLE;

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        AccessControlChallenge = await ethers.getContractFactory("AccessControlChallenge")
        accessControlChallenge = await AccessControlChallenge.deploy()

        WRITER_ROLE = await accessControlChallenge.WRITER_ROLE();
    });

    describe("Contract deployment", function () {

        it("Contract was Created successfully", async function () {
            expect(
                await accessControlChallenge.owner()
            ).to.be.equal(owner.address);
        });

    });

    describe("Roles", function () {

        it("ADMIN can add Writers", async function () {
            await accessControlChallenge.grantRole(WRITER_ROLE, addr1.address);
            expect(
                await accessControlChallenge.hasRole(WRITER_ROLE, addr1.address)
            ).to.be.equal(true);
        });

        it("non-ADMIN can't add Writers", function () {
            expect(
                accessControlChallenge.connect(addr1).grantRole(WRITER_ROLE, addr2.address)
            ).to.be.reverted;
        });

    });

    describe("Operations", function () {

        it("store function call with Writer role", async function () {
            await accessControlChallenge.grantRole(WRITER_ROLE, addr1.address);
            expect(
                await accessControlChallenge.connect(addr1).storeText("Test string")
            ).to.be.equal("Test string");
        });

        it("reverted transaction when non-Writer calls store function", function () {
            expect(
                accessControlChallenge.connect(addr1).storeText("Failed Exec")
            ).to.be.revertedWith(
                "Only account with WRITER_ROLE can execute this!"
            );
        });

        it("receive function call by several roles", async function () {
            expect(
                await accessControlChallenge.receiveNumber(99)
            ).to.be.equal(99);
        });
    });



});









