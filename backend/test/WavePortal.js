const { expect } = require("chai");

describe("WavePortal contract", function () {

  let waveContractFactory;
  let waveContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

    beforeEach(async function () {
        waveContractFactory = await ethers.getContractFactory('WavePortal');
        [owner, addr1, addr2] = await ethers.getSigners();

        waveContract = await waveContractFactory.deploy({
            value: ethers.utils.parseEther('0.1'),
        });
        await waveContract.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await waveContract.owner()).to.equal(owner.address);
        });

        it("Contract should have an inital value of .1", async function () {
            let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
            expect(hre.ethers.utils.formatEther(contractBalance)).to.equal('0.1');
        });

        it("Initial winning odds should be 30", async function () {
            expect(await waveContract.winningOdds()).to.equal(30);
        });

        it("Initial prize should be .0001 ether", async function () {
            expect(hre.ethers.utils.formatEther(await waveContract.prizeAmount())).to.equal('0.0001');
        });
    });

    describe("Owner only functions", function () {
        it("Should be able to change winning odds", async function () {
            expect(await waveContract.winningOdds()).to.equal(30);
            await waveContract.setWinningOdds(40)
            expect(await waveContract.winningOdds()).to.equal(40);
        });

        it("Should be able to change winning ether", async function () {
            expect(hre.ethers.utils.formatEther(await waveContract.prizeAmount())).to.equal('0.0001');
            await waveContract.setPrizeAmount(200000000000000);
            expect(hre.ethers.utils.formatEther(await waveContract.prizeAmount())).to.equal('0.0002');
        });
    });

    describe("Wave functions", function () {
        it("Should be able to wave", async function () {

        });

    });
});
