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

        it("Should NOT be able to change winning odds", async function () {
            const acc = addr2.address;

            await network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [acc]
            });

            const impersonatedAccount = await ethers.provider.getSigner(acc);
            let contractAsImpersonator = waveContract.connect(impersonatedAccount);

            expect(await contractAsImpersonator.owner()).to.not.equal(acc);            
            expect(contractAsImpersonator.setWinningOdds(40)).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it("Should NOT be able to change winning ether", async function () {
            const acc = addr2.address;

            await network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [acc]
            });

            const impersonatedAccount = await ethers.provider.getSigner(acc);
            let contractAsImpersonator = waveContract.connect(impersonatedAccount);

            expect(await contractAsImpersonator.owner()).to.not.equal(acc);            
            expect(contractAsImpersonator.setPrizeAmount(2000000000)).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("Wave functions", function () {
        it("Should be able to wave", async function () {
            await expect(await waveContract.wave('ayyyy'))
                .to.emit(waveContract, 'NewWave');
                // .withArgs(owner.address, 'ayyyy', waveContract.getTime());
        });

        it("Should not be able to wave twice in 15m", async function () {
            expect(await waveContract.wave('ayyyy'))
                .to.emit(waveContract, 'NewWave');

            expect(waveContract.wave('ayyyy'))
                .to.be.revertedWith('Wait 15m');
        });

        it("Should not be able to wave again after 15m", async function () {
            expect(await waveContract.wave('ayyyy'))
                .to.emit(waveContract, 'NewWave');

            // Add 15 mins to the next block timestamp to test 
            timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber()))["timestamp"];
            await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp+60*15]);
            await ethers.provider.send("evm_mine");

            expect(await waveContract.wave('ayyyy'))
                .to.emit(waveContract, 'NewWave');
        });

    });
});