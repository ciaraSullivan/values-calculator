import React, { Component } from "react"
import { Alert } from "react-native"
import { Text, View, StyleSheet, Button, Modal, TouchableOpacity, TextInput } from "react-native"
import { BottomSheet, ListItem } from "react-native-elements"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

class Main extends Component {
	constructor(props) {
		super(props)
		this.state = {
			resultText: "",
			calculationText: "",
			operations: ["DEL", "+", "-", "*", "/"],
			valueName: "",
			valueNumber: "",
			isVisible: false,
			showModal: false,
			myValues: [
				{
					title: "example 2",
					value: "869",
					onPress: () => {
						this._onPressButton("869")
						this.setIsVisible(false)
					},
				},
				{
					title: "example 1",
					value: "822",
					onPress: () => {
						this._onPressButton("822")
						this.setIsVisible(false)
					},
				},
			],
		}
	}

	addValue() {
		if (Number(this.state.valueNumber)) {
			const newValue = {
				title: this.state.valueName,
				value: this.state.valueNumber,
				onPress: () => {
					this._onPressButton(this.state.valueNumber)
					this.setIsVisible(false)
				},
			}

			const newMyValues = [newValue, ...this.state.myValues]

			this.setState({
				myValues: newMyValues,
				valueName: "",
				valueNumber: "",
			})
			console.log(newMyValues)
			this.toggleModal()
		} else {
			Alert.alert("Invalid Number", "Please enter a valid number as the value.", [
				{
					text: "Ok",
					style: "cancel",
					onPress: () => console.log("Cancel Pressed"),
				},
			])
		}
	}

	calculationResult() {
		const text = this.state.resultText
		this.setState({
			calculationText: eval(text),
		})
	}

	validate() {
		if (this.state.operations.includes(this.state.resultText.slice(-1))) {
			return false
		}
		return true
	}

	_onPressButton(text) {
		console.log(text)

		if (text == "=") {
			return this.validate() && this.calculationResult(this.state.resultText)
		}

		this.setState({
			resultText: this.state.resultText + text,
		})
	}

	operate(operation) {
		if (operation === "DEL") {
			console.log(this.state.resultText)
			this.setState({
				resultText: "",
				calculationText: "",
			})
		} else {
			this._onPressButton(operation)
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

	render() {
		let rows = []
		let nums = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[".", 0, "="],
		]
		for (let i = 0; i < 4; i++) {
			let row = []
			for (let j = 0; j < 3; j++) {
				row.push(
					<TouchableOpacity
						key={nums[i][j]}
						style={styles.btn}
						onPress={() => this._onPressButton(nums[i][j])}
					>
						<Text style={styles.btnText}>{nums[i][j]}</Text>
					</TouchableOpacity>
				)
			}
			rows.push(
				<View key={i} style={styles.row}>
					{row}
				</View>
			)
		}

		let ops = []
		for (let i = 0; i < 5; i++) {
			ops.push(
				<TouchableOpacity
					key={this.state.operations[i]}
					style={styles.btn}
					onPress={() => this.operate(this.state.operations[i])}
				>
					<Text style={[styles.btnText, styles.white]}>{this.state.operations[i]}</Text>
				</TouchableOpacity>
			)
		}

		return (
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Text style={styles.title}>Values Calculator</Text>
					<View style={styles.container}>
						<View style={styles.result}>
							<Text style={styles.resultText}>{this.state.resultText}</Text>
						</View>
						<View style={styles.calculation}>
							<Text style={styles.calculationText}>
								{this.state.calculationText}{" "}
							</Text>
						</View>
						<View style={styles.buttons}>
							<View style={styles.numbers}>{rows}</View>
							<View style={styles.operations}>{ops}</View>
						</View>
						<Button
							title='My Values'
							style={styles.valueBtn}
							onPress={() => this.setIsVisible(true)}
						/>
					</View>

					<BottomSheet
						isVisible={this.state.isVisible}
						containerStyle={{
							backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
						}}
						onBackButtonPress={() => this.setIsVisible(false)}
						onBackdropPress={() => this.setIsVisible(false)}
					>
						{this.state.myValues.map((l, i) => (
							<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
								<ListItem.Content>
									<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
									<ListItem.Subtitle>{l.value}</ListItem.Subtitle>
								</ListItem.Content>
								<ListItem.Chevron
									type='font-awesome'
									name='window-close-o'
									color='black'
									onPress={() => {
										Alert.alert(
											"Delete Value",
											`Are you sure you want to delete the value: ${l.title}: ${l.value} ?`,
											[
												{
													text: "Cancel",
													style: "cancel",
													onPress: () => console.log("Cancel Pressed"),
												},
												{
													text: "YES",
													onPress: () => {
														let filteredValues = this.state.myValues.filter(
															(item) => item.title !== l.title
														)
														this.setState({
															myValues: filteredValues,
														})
													},
												},
											]
										)
									}}
								/>
							</ListItem>
						))}
						<ListItem
							key={"add"}
							containerStyle={{ backgroundColor: "green" }}
							onPress={() => {
								this.toggleModal()
							}}
						>
							<ListItem.Content>
								<ListItem.Title style={{ color: "white" }}>Add</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem
							key={"cancel"}
							containerStyle={{ backgroundColor: "red" }}
							onPress={() => this.setIsVisible(false)}
						>
							<ListItem.Content>
								<ListItem.Title style={{ color: "white" }}>Cancel</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</BottomSheet>
					<Modal
						transparent={false}
						visible={this.state.showModal}
						onRequestClose={() => this.toggleModal()}
					>
						<View>
							<Text>Name of Value:</Text>
							<TextInput
								value={this.state.valueName}
								onChangeText={(valueName) =>
									this.setState({ valueName: valueName })
								}
							/>
							<Text>Value:</Text>
							<TextInput
								value={this.state.valueNumber}
								keyboardType='numeric'
								onChangeText={(valueNumber) =>
									this.setState({ valueNumber: valueNumber })
								}
							/>
							<Button
								title='Add Value'
								onPress={() => {
									this.addValue()
								}}
							/>
						</View>
					</Modal>
				</SafeAreaView>
			</SafeAreaProvider>
		)
	}
}

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
	},
	container: {
		flex: 1,
	},
	row: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-around",
		alignItems: "stretch",
	},
	resultText: {
		fontSize: 25,
		paddingRight: 10,
		color: "black",
	},
	btnText: {
		fontSize: 40,
		color: "white",
	},
	white: {
		color: "white",
	},
	btn: {
		flex: 1,
		alignItems: "center",
		alignSelf: "stretch",
		justifyContent: "center",
	},
	result: {
		flex: 2,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "flex-end",
	},
	calculation: {
		flex: 1,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "flex-end",
	},
	calculationText: {
		fontSize: 50,
		paddingRight: 10,
		color: "black",
	},
	buttons: {
		flex: 7,
		flexDirection: "row",
	},
	numbers: {
		flex: 3,
		padding: 1,
		backgroundColor: "#1e2326",
	},
	operations: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "stretch",
		backgroundColor: "#454e54",
	},
	valueBtn: {
		flex: 1,
		paddingTop: 20,
		paddingBottom: 20,
	},
})

export default Main
