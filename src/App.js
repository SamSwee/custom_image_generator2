import React, { useRef, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts.css';
import { storeNFT } from './NFTStorageService';
import { ethers } from 'ethers';
import contractInstance from './contractInstance';

function App() {
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [userAddress, setUserAddress] = useState(null);
    const [networkSwitchAttempted, setNetworkSwitchAttempted] = useState(false);

    const canvasRef = useRef(null);
    const imageObj = new Image();

    const handleSubmit = () => {
        setSubmitted(true);
    };

    useEffect(() => {
        if (submitted && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            let fontSize = name.length > 14 ? "22pt" : "30pt"; //adjusts font size

            imageObj.onload = function () {
                ctx.drawImage(imageObj, 0, 0);
                ctx.font = `${fontSize} AlataRegular`;
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "center";
                ctx.fillText(name, (canvas.width / 2) - 3, 175);
            };
            imageObj.src = "DMC_badge.png";
        }
    }, [submitted]);

    useEffect(() => {
        async function connectWallet() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                // Try to switch to Sepolia network only if it hasn't been attempted before
                if (!networkSwitchAttempted) {
                    try {
                        await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]);
                        console.log("You have switched to the right network");
                    } catch (switchError) {
                        if (switchError.code === 4902) {
                            console.log("Please add the Sepolia network to MetaMask");
                        } else {
                            console.log("Cannot switch to the network");
                        }
                    } finally {
                        setNetworkSwitchAttempted(true);
                    }
                }

                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setUserAddress(accounts[0]);
                    console.log(userAddress);
                } catch (error) {
                    console.error("User denied account access");
                }
            } else {
                alert('Please install MetaMask!');
            }
        }

        // This is the event listener to listen to account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                setUserAddress(accounts[0]);
            });
        }

        connectWallet();

        // Cleanup the event listener on unmount
        return () => window.ethereum && window.ethereum.removeListener('accountsChanged', setUserAddress);
    }, [networkSwitchAttempted]);

    const mintNFT = async () => {
        // Convert canvas to Blob
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
            try {
                // Store the image to NFT.Storage
                setProgressMessage("Uploading image to IPFS");
                const metadata = await storeNFT(blob, name + "'s Badge of Completion", "Congratulations on completing the StackUp x DeFiChain campaign!"); // Adjust as needed

                // Here, metadata.url will contain the IPFS link to your image
                console.log("NFT stored at:", metadata.url);
                setProgressMessage("Minting NFT...");
                // Now you can proceed to mint the NFT using the metadata on the Sepolia network
                const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
                const connectedContract = contractInstance.connect(signer);
                const tx = await connectedContract.mint(metadata.url); // Assuming your mint function accepts the metadata URL
                const txReceipt = await tx.wait();

                setProgressMessage(`NFT minted successfully. Transaction hash: ${txReceipt.transactionHash}`);

            } catch (error) {
                console.error("Error minting NFT:", error);
                setProgressMessage("Error minting NFT. Please try again.");
            }
        });
    }

    return (
        <div className="container mt-5">
            <div style={{ fontFamily: 'AlataRegular', position: 'absolute', opacity: 0 }}>
                Load Font
            </div>
            <h1 className="text-center mb-4">Get your NFT for completing the DeFiChain campaign!</h1>
            {!submitted ? (
                <>
                    <div className="sample-image text-center mt-5">
                        <img src="sample.png" width="30%" alt="sample of what to expect" />
                    </div>

                    <div className="input-group mt-5 justify-content-center">
                        <input
                            type="text"
                            className="form-control-sm"
                            id="name"
                            placeholder="Type your StackUp name here" 
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-primary" style={{ marginLeft: '5px' }} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <canvas id="myCanvas" ref={canvasRef} width="640" height="640" style={{ display: 'block', margin: 'auto' }}></canvas>
                    <p className="text-center mt-3">Right click, save this image and share it in the tweet.</p>
                    <p className="text-center">If you want the NFT, click on the Mint button. You will need to pay for gas on the Sepolia network, so do ensure you have sufficient <a href="https://sepoliafaucet.com/">Sepolia tokens</a>.</p>
                    <div className="text-center mt-3">
                        <button className="btn btn-secondary" style={{ marginRight: '15px' }} onClick={() => setSubmitted(false)}>Back</button>
                        <a className="twitter-share-button btn btn-primary" id="tweet" href={`https://twitter.com/intent/tweet?text=I just completed StackUp's DeFiChain Campaign and created a token swap dapp! &url=https://app.stackup.dev/campaign_page/navigating-web3-with-defichain`} target="_blank" rel="noreferrer" style={{ opacity: 1 }}>
                            Tweet
                        </a>
                        <button className="btn" style={{ marginLeft: '15px', backgroundColor: '#c762c4', color: 'white' }} title="One click is all that is needed" onClick={mintNFT}>Mint</button>
                    </div>

                    <div>{progressMessage}</div>
                </>
            )}
        </div>
    );
}

export default App;