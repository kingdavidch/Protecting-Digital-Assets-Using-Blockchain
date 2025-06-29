const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("DigitalAsset", function () {
  let DigitalAsset, digitalAsset, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    DigitalAsset = await ethers.getContractFactory("DigitalAsset");
    digitalAsset = await DigitalAsset.deploy();
    await digitalAsset.waitForDeployment();
  });

  it("should register a new asset", async function () {
    const assetHash = "QmTestHash";
    const metadata = "Test asset metadata";
    await expect(digitalAsset.connect(addr1).registerAsset(assetHash, metadata))
      .to.emit(digitalAsset, "AssetRegistered");
    // Compute assetId
    const assetId = ethers.keccak256(
      ethers.solidityPacked(["string", "address"], [assetHash, addr1.address])
    );
    const asset = await digitalAsset.getAsset(assetId);
    expect(asset[0]).to.equal(assetHash);
    expect(asset[1]).to.equal(addr1.address);
    expect(asset[3]).to.equal(metadata);
  });

  it("should not allow duplicate asset registration", async function () {
    const assetHash = "QmTestHash";
    const metadata = "Test asset metadata";
    await digitalAsset.connect(addr1).registerAsset(assetHash, metadata);
    await expect(
      digitalAsset.connect(addr1).registerAsset(assetHash, metadata)
    ).to.be.revertedWith("Asset already registered");
  });

  it("should transfer asset ownership", async function () {
    const assetHash = "QmTestHash";
    const metadata = "Test asset metadata";
    await digitalAsset.connect(addr1).registerAsset(assetHash, metadata);
    const assetId = ethers.keccak256(
      ethers.solidityPacked(["string", "address"], [assetHash, addr1.address])
    );
    await expect(
      digitalAsset.connect(addr1).transferAsset(assetId, addr2.address)
    ).to.emit(digitalAsset, "AssetOwnershipTransferred")
      .withArgs(assetId, addr1.address, addr2.address, anyValue);
    const asset = await digitalAsset.getAsset(assetId);
    expect(asset[1]).to.equal(addr2.address);
  });

  it("should not allow non-owners to transfer asset", async function () {
    const assetHash = "QmTestHash";
    const metadata = "Test asset metadata";
    await digitalAsset.connect(addr1).registerAsset(assetHash, metadata);
    const assetId = ethers.keccak256(
      ethers.solidityPacked(["string", "address"], [assetHash, addr1.address])
    );
    await expect(
      digitalAsset.connect(addr2).transferAsset(assetId, owner.address)
    ).to.be.revertedWith("Only owner can transfer");
  });

  it("should verify asset integrity", async function () {
    const assetHash = "QmTestHash";
    const metadata = "Test asset metadata";
    await digitalAsset.connect(addr1).registerAsset(assetHash, metadata);
    const assetId = ethers.keccak256(
      ethers.solidityPacked(["string", "address"], [assetHash, addr1.address])
    );
    const isValid = await digitalAsset.verifyAsset(assetId, assetHash);
    expect(isValid).to.be.true;
    const isInvalid = await digitalAsset.verifyAsset(assetId, "FakeHash");
    expect(isInvalid).to.be.false;
  });
}); 