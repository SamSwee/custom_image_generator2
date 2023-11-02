import { ethers } from 'ethers';

let provider;

// Use MetaMask's provider
if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
}
// Fallback to localhost if no web3 injection
else {
    provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
}

export default provider;