const main = async () => {


  const grandidaToken = await hre.ethers.getContractFactory('grandidaToken'); //this is like a function factory or a class that is going to generate instances of that specific contract;
  const Grandidatoken = await grandidaToken.deploy();

  await Grandidatoken.deployed();

 

  console.log("grandidaToken deployed to:", Grandidatoken.address);
  //0xF6D46D5Fc63E97252925A0F4bE3642404Deb419E my deployed smart contract address 
  
  
}


const runMain = async () =>{
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();