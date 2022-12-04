import React, { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateProvider";

function useAppState() {
	const { appIsReady, error, setError } = useContext(AppStateContext);
	return { appIsReady, error, setError };
}

export default useAppState;
