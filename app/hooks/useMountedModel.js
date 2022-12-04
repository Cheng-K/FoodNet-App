import React, { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateProvider";

function useMountedModel() {
	const {
		mountedModel,
		modelIsRunning,
		setModelIsRunning,
		predictedResult,
		setPredictedResult,
	} = useContext(AppStateContext);
	return {
		mountedModel,
		modelIsRunning,
		setModelIsRunning,
		predictedResult,
		setPredictedResult,
	};
}

export default useMountedModel;
