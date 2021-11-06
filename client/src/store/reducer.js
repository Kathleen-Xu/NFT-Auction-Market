

//store initial state
const defaultRootState = {
    nft: [],
    account: 'xkl',
    NFTContract: null,
    AuctionContract: null
};


//reducer
export const NFTReducer = (state = {defaultRootState}, action) => {
    switch (action.type) {
        case 'todos/setNFT':
            return {
                ...state,
                nft: action.payload
            };
        case 'todos/setAccount':
            return {
                ...state,
                account: action.payload
            };
        case 'todos/setNFTContract':
            return {
                ...state,
                NFTContract: action.payload
            };
        case 'todos/setAuctionContract':
            return {
                ...state,
                AuctionContract: action.payload
            };
        default:
            return state;
    }
};

export const selectNFTReducer = (state = {}, action) => {
    switch (action.type) {
        case 'todos/selectNFT':
            return {
                ...state,
                nft: action.payload
            };
        case 'todos/removeNFT':
            return {
                ...state,
                nft: ''
            };
        default:
            return state;
    }
};

export default NFTReducer;

