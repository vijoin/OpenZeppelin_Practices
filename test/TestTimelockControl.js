const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimelockController Contract", function () {

  let TestTimelockController;
  let testTimelockController;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let MODERATOR_ROLE;
  let PROPOSER_ROLE;
  let EXECUTOR_ROLE;

  beforeEach(async function () {

    TestTimelockController = await ethers.getContractFactory("TestTimelockController");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    testTimelockController = await TestTimelockController.deploy(1, [], []);
    MODERATOR_ROLE = await testTimelockController.MODERATOR_ROLE();
    PROPOSER_ROLE = await testTimelockController.PROPOSER_ROLE();
    EXECUTOR_ROLE = await testTimelockController.EXECUTOR_ROLE();

    await testTimelockController.grantRole(PROPOSER_ROLE, addr2.address);
    await testTimelockController.grantRole(MODERATOR_ROLE, addr3.address);
    await testTimelockController.grantRole(EXECUTOR_ROLE, addr3.address);
  });

  describe("Schedule", function () {

    this.timeout(500000); 

    it("Test schedule banning an user", async function () {

        // bytes32 representation of banUser(address)
        let ABI = [ "function banUser(address account)" ];
        let iface = new ethers.utils.Interface(ABI);
        calldata = iface.encodeFunctionData("banUser", [ addr1.address ])

        const target = testTimelockController.address; // "address target" 
        const value = 0; // "uint256 value" 
        const data = calldata; // "bytes32 data" 
        const predecessor = ethers.constants.HashZero; // "bytes32 predecessor" 
        const salt = ethers.utils.formatBytes32String("x"); // "bytes32 salt" 
        const delay = 1; // "uint256 delay" 

        operationId = await testTimelockController.hashOperation(
            target,
            value,
            data,
            predecessor,
            salt,
        );

        const txn_schedule = await testTimelockController.connect(addr2).schedule(
            target,
            value,
            data,
            predecessor,
            salt,
            delay,
        );

        await txn_schedule.wait();

        isOperation = await testTimelockController.isOperation(operationId);
        expect(isOperation).to.be.equal(true);

        isPending = await testTimelockController.isOperationPending(operationId);
        expect(isPending).to.be.equal(true);

        await new Promise(r => setTimeout(r, 1000));

        // TODO: Test that an operation becomes ready after X amount of time passed

        // isReady = await testTimelockController.isOperationReady(operationId);
        // expect(isReady).to.be.equal(false);
   
        // TODO: test execution
        // [WIP] Error: 'TimelockController: underlying transaction reverted'
        // Probably related to the calldata and ROLE needed to ban an user
        
        const txn_execute = await testTimelockController.connect(addr3).execute(
            target,
            value,
            data,
            predecessor,
            salt
        );
        await txn_execute.wait();

        // TODO: test is done
        isDone = await testTimelockController.isOperationDone(operationId);
        expect(isDone).to.be.equal(true);
    
        // test that original action was executed

        // TODO: still trying to make it work

    })
  });
});