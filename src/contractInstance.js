import { ethers } from 'ethers';
import provider from './ethersProvider';
import abi from './contractABI';

const contractAddress = '0xD493F71623D58132dCe3c4664f475d7aaB94cA10';

const contractInstance = new ethers.Contract(contractAddress, abi, provider);

export default contractInstance;
