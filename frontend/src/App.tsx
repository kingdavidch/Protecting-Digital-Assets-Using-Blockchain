import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// TypeScript declarations for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Import the contract ABI (you'll need to generate this)
const CONTRACT_ABI = [
  "function registerAsset(string assetHash, string metadata) external",
  "function transferAsset(bytes32 assetId, address newOwner) external",
  "function getAsset(bytes32 assetId) external view returns (string, address, uint256, string, address[])",
  "function verifyAsset(bytes32 assetId, string assetHash) external view returns (bool)",
  "function getAssetsByOwner(address owner) external view returns (bytes32[])",
  "event AssetRegistered(bytes32 indexed assetId, address indexed owner, string assetHash, string metadata, uint256 timestamp)",
  "event AssetOwnershipTransferred(bytes32 indexed assetId, address indexed previousOwner, address indexed newOwner, uint256 timestamp)"
];

interface Asset {
  id: string;
  hash: string;
  owner: string;
  timestamp: number;
  metadata: string;
  transferHistory: string[];
}

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [assetHash, setAssetHash] = useState('');
  const [metadata, setMetadata] = useState('');
  const [transferAssetId, setTransferAssetId] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [verifyAssetId, setVerifyAssetId] = useState('');
  const [verifyHash, setVerifyHash] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || '');
        });
        
        setMessage('Wallet connected successfully!');
      } else {
        setMessage('Please install MetaMask!');
      }
    } catch (error) {
      setMessage('Error connecting wallet: ' + error);
    }
  };

  const deployContract = async () => {
    if (!signer) {
      setMessage('Please connect your wallet first!');
      return;
    }

    setLoading(true);
    try {
      // This would typically be done through Hardhat deployment
      // For demo purposes, we'll use a placeholder
      setContractAddress('0x...'); // Replace with actual deployed address
      setMessage('Contract deployed! (Replace with actual deployment)');
    } catch (error) {
      setMessage('Error deploying contract: ' + error);
    }
    setLoading(false);
  };

  const connectToContract = async () => {
    if (!signer || !contractAddress) {
      setMessage('Please connect wallet and provide contract address!');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      setContract(contract);
      setMessage('Connected to contract!');
      loadAssets();
    } catch (error) {
      setMessage('Error connecting to contract: ' + error);
    }
  };

  const registerAsset = async () => {
    if (!contract || !assetHash || !metadata) {
      setMessage('Please fill in all fields and connect to contract!');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.registerAsset(assetHash, metadata);
      await tx.wait();
      setMessage('Asset registered successfully!');
      setAssetHash('');
      setMetadata('');
      loadAssets();
    } catch (error) {
      setMessage('Error registering asset: ' + error);
    }
    setLoading(false);
  };

  const transferAsset = async () => {
    if (!contract || !transferAssetId || !transferTo) {
      setMessage('Please fill in all fields!');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.transferAsset(transferAssetId, transferTo);
      await tx.wait();
      setMessage('Asset transferred successfully!');
      setTransferAssetId('');
      setTransferTo('');
      loadAssets();
    } catch (error) {
      setMessage('Error transferring asset: ' + error);
    }
    setLoading(false);
  };

  const verifyAsset = async () => {
    if (!contract || !verifyAssetId || !verifyHash) {
      setMessage('Please fill in all fields!');
      return;
    }

    try {
      const isValid = await contract.verifyAsset(verifyAssetId, verifyHash);
      setMessage(isValid ? 'Asset is valid!' : 'Asset is invalid!');
    } catch (error) {
      setMessage('Error verifying asset: ' + error);
    }
  };

  const loadAssets = async () => {
    if (!contract || !account) return;

    try {
      const assetIds = await contract.getAssetsByOwner(account);
      const assetPromises = assetIds.map(async (id: string) => {
        const asset = await contract.getAsset(id);
        return {
          id,
          hash: asset[0],
          owner: asset[1],
          timestamp: Number(asset[2]),
          metadata: asset[3],
          transferHistory: asset[4]
        };
      });
      
      const assetList = await Promise.all(assetPromises);
      setAssets(assetList);
    } catch (error) {
      setMessage('Error loading assets: ' + error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Digital Asset Protection System</h1>
        <p>Secure your digital assets using blockchain technology</p>
      </header>

      <main className="App-main">
        {/* Wallet Connection */}
        <section className="section">
          <h2>Wallet Connection</h2>
          <div className="wallet-info">
            <p>Account: {account || 'Not connected'}</p>
            <button onClick={connectWallet} disabled={!!account}>
              {account ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </section>

        {/* Contract Management */}
        <section className="section">
          <h2>Contract Management</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
            <button onClick={deployContract} disabled={!signer || loading}>
              Deploy Contract
            </button>
            <button onClick={connectToContract} disabled={!signer || !contractAddress}>
              Connect to Contract
            </button>
          </div>
        </section>

        {/* Asset Registration */}
        <section className="section">
          <h2>Register New Asset</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Asset Hash"
              value={assetHash}
              onChange={(e) => setAssetHash(e.target.value)}
            />
            <input
              type="text"
              placeholder="Metadata"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
            />
            <button onClick={registerAsset} disabled={!contract || loading}>
              Register Asset
            </button>
          </div>
        </section>

        {/* Asset Transfer */}
        <section className="section">
          <h2>Transfer Asset</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Asset ID"
              value={transferAssetId}
              onChange={(e) => setTransferAssetId(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Owner Address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
            <button onClick={transferAsset} disabled={!contract || loading}>
              Transfer Asset
            </button>
          </div>
        </section>

        {/* Asset Verification */}
        <section className="section">
          <h2>Verify Asset</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Asset ID"
              value={verifyAssetId}
              onChange={(e) => setVerifyAssetId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Asset Hash to Verify"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
            />
            <button onClick={verifyAsset} disabled={!contract}>
              Verify Asset
            </button>
          </div>
        </section>

        {/* Asset List */}
        <section className="section">
          <h2>Your Assets</h2>
          <button onClick={loadAssets} disabled={!contract}>
            Refresh Assets
          </button>
          <div className="assets-list">
            {assets.map((asset) => (
              <div key={asset.id} className="asset-card">
                <h3>Asset ID: {asset.id}</h3>
                <p><strong>Hash:</strong> {asset.hash}</p>
                <p><strong>Owner:</strong> {asset.owner}</p>
                <p><strong>Metadata:</strong> {asset.metadata}</p>
                <p><strong>Registered:</strong> {new Date(asset.timestamp * 1000).toLocaleString()}</p>
                <p><strong>Transfer History:</strong> {asset.transferHistory.join(' → ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Status Messages */}
        {message && (
          <section className="section">
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          </section>
        )}

        {loading && (
          <div className="loading">
            Processing transaction...
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
