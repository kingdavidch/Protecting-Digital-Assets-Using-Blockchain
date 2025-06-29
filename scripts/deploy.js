const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DigitalAsset = await ethers.getContractFactory("DigitalAsset");
  const digitalAsset = await DigitalAsset.deploy();

  await digitalAsset.waitForDeployment();

  console.log("DigitalAsset deployed to:", await digitalAsset.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 