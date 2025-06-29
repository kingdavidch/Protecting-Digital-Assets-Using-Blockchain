# Digital Asset Protection Using Blockchain

A comprehensive blockchain-based system for securing and managing digital assets using Ethereum smart contracts. This project provides a complete solution for registering, transferring, and verifying digital assets with immutable ownership records and cryptographic integrity verification.

## 🚀 Features

- **Digital Asset Registration**: Register digital assets with cryptographic hashes and metadata
- **Ownership Transfer**: Securely transfer asset ownership with blockchain verification
- **Asset Integrity Verification**: Verify asset authenticity using cryptographic proofs
- **Transparent Audit Trail**: Complete history of all asset transfers and ownership changes
- **Modern Web Interface**: User-friendly React frontend with MetaMask integration
- **Smart Contract Security**: Built with OpenZeppelin contracts and best practices

## 🏗️ Architecture

### Smart Contract (`DigitalAsset.sol`)
- **Asset Registration**: Store asset hashes, metadata, and ownership information
- **Transfer Management**: Secure ownership transfer with event logging
- **Verification System**: Cryptographic proof verification for asset integrity
- **Audit Trail**: Complete transfer history for each asset

### Frontend Application
- **React TypeScript**: Modern, type-safe user interface
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Real-time Updates**: Live asset management and status updates
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Ethereum testnet account (Sepolia/Goerli) with test ETH

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Protecting Digital Assets Using Blockchain"
```

### 2. Install Dependencies
```bash
# Install smart contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Network URLs (get from Infura, Alchemy, etc.)
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
GOERLI_URL=https://goerli.infura.io/v3/YOUR-PROJECT-ID

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas reporting
REPORT_GAS=true
```

### 4. Compile Smart Contracts
```bash
npx hardhat compile
```

### 5. Run Tests
```bash
npx hardhat test
```

### 6. Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 7. Start Frontend
```bash
cd frontend
npm start
```

## 🎯 Usage

### Smart Contract Functions

#### Register Asset
```solidity
function registerAsset(string memory assetHash, string memory metadata) external
```
- Registers a new digital asset with its cryptographic hash and metadata
- Only the caller can register assets
- Emits `AssetRegistered` event

#### Transfer Asset
```solidity
function transferAsset(bytes32 assetId, address newOwner) external
```
- Transfers asset ownership to a new address
- Only the current owner can transfer
- Emits `AssetOwnershipTransferred` event

#### Verify Asset
```solidity
function verifyAsset(bytes32 assetId, string memory assetHash) external view returns (bool)
```
- Verifies asset integrity by comparing hashes
- Returns true if the asset hash matches the registered hash

#### Get Asset Details
```solidity
function getAsset(bytes32 assetId) external view returns (string, address, uint256, string, address[])
```
- Returns complete asset information including ownership history

### Frontend Features

1. **Wallet Connection**: Connect MetaMask wallet to interact with the blockchain
2. **Contract Deployment**: Deploy the smart contract to your chosen network
3. **Asset Registration**: Register new digital assets with hashes and metadata
4. **Asset Transfer**: Transfer ownership of assets to other addresses
5. **Asset Verification**: Verify asset integrity using cryptographic proofs
6. **Asset Management**: View and manage all your registered assets

## 🔧 Development

### Project Structure
```
├── contracts/           # Smart contracts
│   └── DigitalAsset.sol
├── frontend/           # React application
│   ├── src/
│   └── public/
├── scripts/            # Deployment scripts
│   └── deploy.js
├── test/              # Test files
│   └── DigitalAsset.js
├── hardhat.config.js  # Hardhat configuration
└── README.md
```

### Testing
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/DigitalAsset.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Deployment
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet (use with caution)
npx hardhat run scripts/deploy.js --network mainnet
```

## 🔒 Security Features

- **Immutable Records**: All asset registrations and transfers are permanently recorded on the blockchain
- **Cryptographic Verification**: Asset integrity verified using cryptographic hashes
- **Access Control**: Only asset owners can transfer ownership
- **Event Logging**: Complete audit trail through blockchain events
- **OpenZeppelin Integration**: Industry-standard security libraries

## 🌐 Networks

### Testnets
- **Sepolia**: Recommended for testing
- **Goerli**: Alternative testnet

### Mainnet
- **Ethereum**: Production deployment (requires real ETH)

## 📊 Gas Optimization

The smart contract is optimized for gas efficiency:
- Efficient data structures
- Minimal storage operations
- Optimized function calls
- Gas reporting enabled for monitoring

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection Failed**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network
   - Refresh the page and try again

2. **Transaction Failed**
   - Ensure you have sufficient ETH for gas fees
   - Check if the contract is deployed to the correct network
   - Verify all input parameters are correct

3. **Compilation Errors**
   - Ensure all dependencies are installed
   - Check Solidity version compatibility
   - Verify import paths are correct

### Getting Help

- Check the test files for usage examples
- Review the smart contract comments for detailed function descriptions
- Ensure your environment variables are correctly configured

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For questions or support, please open an issue on the GitHub repository.

---

**Note**: This is a demonstration project. For production use, ensure thorough security audits and testing on testnets before mainnet deployment.
