import AsyncStorage from "@react-native-async-storage/async-storage";
import * as tf from "@tensorflow/tfjs";
import * as tf_rn from "@tensorflow/tfjs-react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

import storage from "../config/storage";
import {
	createDatabaseTables,
	dropTable,
	insertRecords,
} from "../utils/database";

export const AppStateContext = React.createContext();

function AppStateProvider({ children }) {
	const [appIsReady, setAppIsReady] = useState(false);
	const [error, setError] = useState(null);
	const [modelIsRunning, setModelIsRunning] = useState(true);
	const [mountedModel, setMountedModel] = useState(null);
	const [predictedResult, setPredictedResult] = useState(null);

	const fetchLatestModelVersion = async () => {
		return tf_rn
			.fetch(storage.fetch_model_version_url)
			.then((result) => result.json())
			.then((data) => data.tag_name);
	};
	const getLocalModelVersion = async () => {
		return AsyncStorage.getItem(storage.model_release);
	};
	const downloadModel = async () => {
		return await tf.loadGraphModel(storage.fetch_model_url);
		// return model.save(storage.model_dir);
	};
	const prepareModel = async () => {
		let latestModelVersion = fetchLatestModelVersion();
		let currentModelVersion = getLocalModelVersion();
		try {
			latestModelVersion = await latestModelVersion;
			currentModelVersion = await currentModelVersion;
			console.log(latestModelVersion);
			console.log(currentModelVersion);
			if (latestModelVersion !== currentModelVersion) {
				console.log(
					`latest : ${latestModelVersion}, current : ${currentModelVersion}`
				);
				const model = await downloadModel();
				setMountedModel(model);
				// await AsyncStorage.setItem(storage.model_release, latestModelVersion);
				console.log("Done");
			}
			// const model = await tf.loadLayersModel(storage.model_dir);
			// setMountedModel(model);
		} catch (error) {
			throw error;
		}
	};
	useEffect(() => {
		if (error) {
			Alert.alert(
				"Something went wrong. Please try again.",
				`Troubleshoot message : ${error.message}`,
				[
					{
						text: "OK",
						onPress: () => setError(null),
					},
				]
			);
		}
	});
	useEffect(() => {
		async function prepareApp() {
			try {
				// await dropTable();
				await createDatabaseTables();
				await tf.ready();
				// await prepareModel();
			} catch (error) {
				console.warn(error);
				setError(error);
			} finally {
				setAppIsReady(true);
			}
		}
		prepareApp();
	}, []);

	return (
		<AppStateContext.Provider
			value={{
				appIsReady,
				setAppIsReady,
				error,
				setError,
				modelIsRunning,
				setModelIsRunning,
				mountedModel,
				predictedResult,
				setPredictedResult,
			}}
		>
			{children}
		</AppStateContext.Provider>
	);
}

export default AppStateProvider;
