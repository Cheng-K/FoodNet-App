import AsyncStorage from "@react-native-async-storage/async-storage";
import * as tf from "@tensorflow/tfjs";
import * as tf_rn from "@tensorflow/tfjs-react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { mmkvStorageIO } from "tfjs-react-native-mmkv-storage";

import storage from "../config/storage";
import { createDatabaseTables } from "../utils/database";

export const AppStateContext = React.createContext();

function AppStateProvider({ children }) {
	const [appIsReady, setAppIsReady] = useState(false);
	const [error, setError] = useState(null);
	const [modelIsRunning, setModelIsRunning] = useState(true);
	const [mountedModel, setMountedModel] = useState(null);
	const [predictedResult, setPredictedResult] = useState(null);
	const [storageLastUpdated, setStorageLastUpdated] = useState(null);

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
	};
	const prepareModel = async () => {
		let latestModelVersion = await fetchLatestModelVersion();
		let currentModelVersion = await getLocalModelVersion();
		let model = null;
		if (latestModelVersion !== currentModelVersion) {
			console.log(
				`latest : ${latestModelVersion}, current : ${currentModelVersion}`
			);
			try {
				model = await downloadModel();
				await model.save(mmkvStorageIO(storage.model_path));
				await AsyncStorage.setItem(
					storage.model_release,
					latestModelVersion
				);
				setMountedModel(model);
				return;
			} catch (error) {
				if (model) {
					setMountedModel(model);
					setError(
						new Error(
							"Unable to save the downloaded model. The app can still be used but the model have to be downloaded everytime.",
							{ cause: error }
						)
					);
					return;
				} else if (currentModelVersion === null) {
					setError(
						new Error(
							"Unable to download required model. The scanning functionality will not work. Please restart the application.",
							{ cause: error }
						)
					);
					return;
				}
			}
		}
		try {
			model = await tf.loadGraphModel(mmkvStorageIO(storage.model_path));
			setMountedModel(model);
		} catch (error) {
			setError(
				new Error(
					"Unable to load required model. The scanning functionality will not work. Please restart the application.",
					{ cause: error }
				)
			);
		}
	};
	useEffect(() => {
		if (error) {
			Alert.alert(
				"Something went wrong. Please try again.",
				`${error.message}`,
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
				await createDatabaseTables();
				await tf.ready();
				await prepareModel();
			} catch (error) {
				setError(
					new Error(
						"The application was not able to load properly. Please restart the application.",
						{ cause: error }
					)
				);
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
				storageLastUpdated,
				setStorageLastUpdated,
			}}
		>
			{children}
		</AppStateContext.Provider>
	);
}

export default AppStateProvider;
