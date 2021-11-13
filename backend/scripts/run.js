const main = async () => {
  // Deploy
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'),
    });

    await waveContract.deployed();
    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    /*
    * Get Contract balance
    */
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );

    // Get wave count
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    // Wave count = 1
    let waveTxn = await waveContract.wave('Hey');
    await waveTxn.wait();
  
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    /*
    * Get Contract balance to see what happened!
    */
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );

    // wave count = 2
    waveTxn = await waveContract.connect(randomPerson).wave('Hey again');
    await waveTxn.wait();
  
    //get all waves
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
  