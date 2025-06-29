// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DigitalAsset is Ownable {
    struct Asset {
        string assetHash;
        address owner;
        uint256 timestamp;
        string metadata;
        address[] transferHistory;
    }

    mapping(bytes32 => Asset) private assets;
    mapping(address => bytes32[]) private ownerAssets;

    event AssetRegistered(bytes32 indexed assetId, address indexed owner, string assetHash, string metadata, uint256 timestamp);
    event AssetOwnershipTransferred(bytes32 indexed assetId, address indexed previousOwner, address indexed newOwner, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function registerAsset(string memory assetHash, string memory metadata) external {
        bytes32 assetId = keccak256(abi.encodePacked(assetHash, msg.sender));
        require(assets[assetId].owner == address(0), "Asset already registered");
        address[] memory history = new address[](1);
        history[0] = msg.sender;
        assets[assetId] = Asset({
            assetHash: assetHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            metadata: metadata,
            transferHistory: history
        });
        ownerAssets[msg.sender].push(assetId);
        emit AssetRegistered(assetId, msg.sender, assetHash, metadata, block.timestamp);
    }

    function transferAsset(bytes32 assetId, address newOwner) external {
        require(assets[assetId].owner == msg.sender, "Only owner can transfer");
        require(newOwner != address(0), "Invalid new owner");
        address previousOwner = assets[assetId].owner;
        assets[assetId].owner = newOwner;
        assets[assetId].transferHistory.push(newOwner);
        ownerAssets[newOwner].push(assetId);
        emit AssetOwnershipTransferred(assetId, previousOwner, newOwner, block.timestamp);
    }

    function getAsset(bytes32 assetId) external view returns (string memory, address, uint256, string memory, address[] memory) {
        Asset storage asset = assets[assetId];
        require(asset.owner != address(0), "Asset does not exist");
        return (asset.assetHash, asset.owner, asset.timestamp, asset.metadata, asset.transferHistory);
    }

    function verifyAsset(bytes32 assetId, string memory assetHash) external view returns (bool) {
        Asset storage asset = assets[assetId];
        require(asset.owner != address(0), "Asset does not exist");
        return (keccak256(abi.encodePacked(asset.assetHash)) == keccak256(abi.encodePacked(assetHash)));
    }

    function getAssetsByOwner(address owner) external view returns (bytes32[] memory) {
        return ownerAssets[owner];
    }
} 