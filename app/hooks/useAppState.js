import React, { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateProvider";

function useAppState() {
	const {
		appIsReady,
		error,
		setError,
		storageLastUpdated,
		setStorageLastUpdated,
	} = useContext(AppStateContext);
	return {
		appIsReady,
		error,
		setError,
		storageLastUpdated,
		setStorageLastUpdated,
	};
}

export default useAppState;
