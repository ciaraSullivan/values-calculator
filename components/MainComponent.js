import React, { Component } from "react"
import { Text, View, StyleSheet, Button, Modal } from "react-native"
import Calculator from "../components/Calculator"
import { BottomSheet, ListItem } from "react-native-elements"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

class Main extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isVisible: false,
			showModal: false,
			myValues: [
				{
					title: "example 1",
					value: "869",
					onPress: () => {
						Calculator._onPressButton("869")
					},
				},
				{
					title: "Add",
					containerStyle: { backgroundColor: "green" },
					titleStyle: { color: "white" },
					onPress: () => {
						this.toggleModal()
					},
				},
				{
					title: "Cancel",
					containerStyle: { backgroundColor: "red" },
					titleStyle: { color: "white" },
					onPress: () => this.setIsVisible(false),
				},
			],
		}
	}

	setIsVisible(toggle) {
		this.setState({
			isVisible: toggle,
		})
	}

	toggleModal() {
		this.setState({
			showModal: !this.state.showModal,
		})
	}

	addValue(newTitle, newValue) {
		let newValues = this.state.myValues.push({ title: newTitle, value: newValue })
		this.setState({
			myValues: newValues,
		})
		//close modal
	}

	render() {
		return (
			<SafeAreaProvider>
				<SafeAreaView>
					<Text>Values Calculator</Text>
					<Calculator />
					<Button title='MyValues' onPress={() => this.setIsVisible(true)} />
					<BottomSheet isVisible={this.state.isVisible} containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}>
						{this.state.myValues.map((l, i) => (
							<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
								<ListItem.Content>
									<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						))}
					</BottomSheet>
					<Modal transparent={false} visible={this.state.showModal} onRequestClose={() => this.toggleModal()}>
						<View>
							<Text>Hi!</Text>
						</View>
					</Modal>
				</SafeAreaView>
			</SafeAreaProvider>
		)
	}
}

export default Main
