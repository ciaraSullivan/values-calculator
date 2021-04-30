import * as ActionTypes from "./ActionTypes"

export const values = (
	state = {
		values: [
			{
				title: "Example",
				value: 12345,
			},
		],
	},
	action
) => {
	switch (action.type) {
		case ActionTypes.ADD_VALUES:
			const newValue = {
				title: action.payloadName,
				value: action.payloadValue,
			}
			return { ...state, values: [newValue, ...state.values] }
		case ActionTypes.DEL_VALUES:
			const filteredValues = state.values.filter((item) => item.title !== action.payload)
			return { ...state, values: filteredValues }
		default:
			return state
	}
}
