import { StatusBar } from "expo-status-bar"
import React from "react"
import Main from "./components/MainComponent"
import { StyleSheet, View } from "react-native"
import { Provider } from "react-redux"
import { ConfigureStore } from "./redux/ConfigureStore"
import { PersistGate } from "redux-persist/es/integration/react"

const { persistor, store } = ConfigureStore()

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<View style={styles.container}>
					<Main />
					<StatusBar style='auto' />
				</View>
			</PersistGate>
		</Provider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
