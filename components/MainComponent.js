import React, { Component } from "react"
import {
	Text,
	View,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TextInput,
	Alert,
	Button,
} from "react-native"
import { BottomSheet, ListItem } from "react-native-elements"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { connect } from "react-redux"
import { addValue, delValue } from "../redux/ActionCreators"

const mapStateToProps = (state) => {
	return {
		values: state.values.values,
	}
}

const mapDispatchToProps = {
	addValue: (name, value) => addValue(name, value),
	delValue: (name) => delValue(name),
}

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
		}
	}

	addValue() {
		if (Number(this.state.valueNumber)) {
			this.props.addValue(this.state.valueName, this.state.valueNumber)
			this.toggleModal()
			this.setState({
				valueNumber: "",
				valueName: "",
			})
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
					<View style={styles.container}>
						<View style={{ flex: 1, backgroundColor: "#fff" }}>
							<Text style={styles.title}>Values Calculator</Text>
						</View>
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
						<View style={{ flex: 1 }}>
							<TouchableOpacity
								style={styles.valueBtn}
								onPress={() => this.setIsVisible(true)}
							>
								<Text style={styles.valueText}>My Values</Text>
							</TouchableOpacity>
						</View>
					</View>
					<BottomSheet
						isVisible={this.state.isVisible}
						containerStyle={{
							backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
						}}
						onBackButtonPress={() => this.setIsVisible(false)}
						onBackdropPress={() => this.setIsVisible(false)}
					>
						{this.props.values.map((l, i) => (
							<ListItem
								key={i}
								containerStyle={l.containerStyle}
								onPress={() => {
									this._onPressButton(l.value)
									this.setIsVisible(false)
								}}
							>
								<ListItem.Content>
									<ListItem.Title style={{ fontSize: 25 }}>
										{l.title}
									</ListItem.Title>
									<ListItem.Subtitle style={{ fontSize: 15 }}>
										{l.value}
									</ListItem.Subtitle>
								</ListItem.Content>
								<ListItem.Chevron
									type='font-awesome'
									name='times'
									color='black'
									iconStyle={{ padding: 10 }}
									size={20}
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
													onPress: () => this.props.delValue(l.title),
												},
											]
										)
									}}
								/>
							</ListItem>
						))}
						<ListItem
							key={"add"}
							containerStyle={{ backgroundColor: "#09657d" }}
							onPress={() => {
								this.toggleModal()
							}}
						>
							<ListItem.Content>
								<ListItem.Title style={styles.valueOptions}>Add</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem
							key={"cancel"}
							containerStyle={{ backgroundColor: "#454e54" }}
							onPress={() => this.setIsVisible(false)}
						>
							<ListItem.Content>
								<ListItem.Title style={styles.valueOptions}>Cancel</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</BottomSheet>
					<Modal
						transparent={true}
						visible={this.state.showModal}
						onRequestClose={() => this.toggleModal()}
					>
						<View style={styles.modalContainer}>
							<Text style={styles.modalText}>Name</Text>
							<TextInput
								value={this.state.valueName}
								style={styles.formInput}
								onChangeText={(valueName) =>
									this.setState({ valueName: valueName })
								}
							/>
							<Text style={styles.modalText}>Value</Text>
							<TextInput
								value={this.state.valueNumber}
								style={styles.formInput}
								keyboardType='numeric'
								onChangeText={(valueNumber) =>
									this.setState({ valueNumber: valueNumber })
								}
							/>
							<TouchableOpacity
								style={styles.valueBtn}
								onPress={() => {
									this.addValue()
								}}
							>
								<Text style={styles.valueText}>Add Value</Text>
							</TouchableOpacity>
						</View>
					</Modal>
				</SafeAreaView>
			</SafeAreaProvider>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#09657d",
	},
	title: {
		textAlign: "center",
		fontSize: 15,
		color: "black",
		letterSpacing: 4,
		paddingTop: 25,
	},
	row: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-around",
		alignItems: "stretch",
	},
	resultText: {
		fontSize: 35,
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
		fontSize: 55,
		paddingRight: 10,
		paddingBottom: 5,
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
		alignItems: "center",
		padding: 20,
		backgroundColor: "#09657d",
		color: "white",
	},
	valueText: {
		textAlign: "center",
		color: "white",
		letterSpacing: 4,
		paddingTop: 5,
		fontSize: 20,
	},
	modalContainer: {
		justifyContent: "center",
		paddingTop: 60,
		paddingRight: 15,
		paddingLeft: 15,
		paddingBottom: 60,
		backgroundColor: "white",
		marginTop: 80,
		borderRadius: 10,
	},
	formInput: {
		marginTop: 25,
		marginBottom: 25,
		padding: 5,
		fontSize: 50,
		textAlign: "right",
		borderColor: "gray",
		borderRadius: 5,
		borderWidth: 2,
	},
	modalText: {
		fontSize: 30,
	},
	valueOptions: {
		padding: 7,
		fontSize: 25,
		color: "white",
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
