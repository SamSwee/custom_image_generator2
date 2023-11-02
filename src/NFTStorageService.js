import { NFTStorage, File } from 'nft.storage';

// Replace this with your API key from NFT.Storage
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxY2VBZjVmMkU0MGZlNzQzNzgyN0YyNUE5MmRiQzRGRjVEMTRDRjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5ODgwODY0ODE4MywibmFtZSI6ImN1c3RvbWltZ2dlbiJ9.i7S_GiFzor84XRy6THCNfIE-ryMeo_9-ZVoShp5YpP4';

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
