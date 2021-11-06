import { combineReducers } from "redux";
import { NFTReducer, selectNFTReducer } from "./reducer";

const reducers = combineReducers({
    allNft: NFTReducer,
    nft: selectNFTReducer,
});

// combine reducer
export default reducers;