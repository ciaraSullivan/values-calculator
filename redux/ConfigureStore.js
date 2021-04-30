import { createStore } from "redux"
import { values } from "./values"
import { persistStore, persistCombineReducers } from "redux-persist"
import storage from "redux-persist/es/storage"

const config = {
	key: "root",
	storage,
	debug: true,
}

export const ConfigureStore = () => {
	const store = createStore(
		persistCombineReducers(config, {
			values,
		})
	)

	const persistor = persistStore(store)

	return { persistor, store }
}
