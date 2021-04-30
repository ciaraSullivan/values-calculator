import * as ActionTypes from "./ActionTypes"

export const addValue = (name, value) => ({
	type: ActionTypes.ADD_VALUES,
	payloadName: name,
	payloadValue: value,
})

export const delValue = (name) => ({
	type: ActionTypes.DEL_VALUES,
	payload: name,
})
