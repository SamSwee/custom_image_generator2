import { NFTStorage, File } from 'nft.storage';

// Replace this with your API key from NFT.Storage
const NFT_STORAGE_KEY = 'YOUR_API_KEY';

const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

export async function storeNFT(blob, name, description) {
    // Convert blob to File object
    const file = new File([blob], `${name}.png`, { type: 'image/png' });

    // Store in NFT.Storage
    return await nftstorage.store({
        name,
        description,
        image: file
    });
}

// You can add other utility functions or related functions here if needed in the future.
