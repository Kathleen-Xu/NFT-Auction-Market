import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducers from "./reducers";
import {persistStore, persistReducer} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {  
  key: 'root', // 必须有的  
  storage:storageSession, // 缓存机制  
  // blacklist: ['loginStatus'] reducer 里不持久化的数据,除此外均为持久化数据  
  whitelist: ['NFTContract', 'AuctionContract'] // reducer 里持久化的数据,除此外均为不持久化数据
}
const persistedReducer = persistReducer(persistConfig, reducers)
const store = createStore(persistedReducer, applyMiddleware(thunk));  
export const persistor = persistStore(store);  


export default store;