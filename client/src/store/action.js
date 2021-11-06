//action creator
export const setNFT = (nft) => {
  return {
    type: 'todos/setNFT',
    payload: nft,
  };
};

export const selectNFT = (nft) => {
  return {
    type: 'todos/selectNFT',
    payload: nft,
  };
};

export const removeNFT = (nft) => {
  return {
    type:'todos/removeNFT',
  };
};

export const setAccount = (account) => {
  return {
    type: 'todos/setAccount',
    payload: account,
  };
};

export const setNFTContract = (NFTcontract) => {
  return {
    type: 'todos/setNFTContract',
    payload: NFTcontract,
  };
};

export const setAuctionContract = (auctioncontract) => {
  return {
    type: 'todos/setAuctionContract',
    payload: auctioncontract,
  };
};