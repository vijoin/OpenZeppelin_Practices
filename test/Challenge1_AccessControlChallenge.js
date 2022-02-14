const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ("Challenge #1 Access Control", function () {

    let owner;
    let AccessControlChallenge;
    let accessControlChallenge;

    beforeEach(async function () {
        [owner, ...addrs] = await ethers.getSigners();
        AccessControlChallenge = await ethers.getContractFactory("AccessControlChallenge")
        accessControlChallenge = await AccessControlChallenge.deploy()
    });

    describe("Contract deployment", function () {

        it("Contract was Created successfully", async function () {
            expect(
                await accessControlChallenge.owner()
            ).to.be.equal(owner.address);
        });

    });

    describe("Roles", function () {

        it("only ADMIN can add Writers", async function () {
            expect(false).to.be.equal(true);
        });

    });

    describe("Operations", function () {

        it("store function call with Writer role", async function () {
            expect(false).to.be.equal(true);
        });

        it("reverted transaction when non-Writer calls store function", async function () {
            expect(false).to.be.equal(true);
        });

        it("receive function call by several roles", async function () {
            expect(false).to.be.equal(true);
        });
    });



});









