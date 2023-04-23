const hre=require("hardhat");


async function main(){

  const name = "Pritam's Metaverse"
  const symbol= "PSM"
  const cost = hre.ethers.utils.parseEther("1");

  const metaverse=await hre.ethers.getContractFactory("Land");
  const  contract=await metaverse.deploy(name,symbol,cost);

  await contract.deployed();
  console.log("Address of contract:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
