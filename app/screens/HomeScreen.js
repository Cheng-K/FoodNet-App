import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as SplashScreen from "expo-splash-screen";

import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import colors from "../config/colors";
import NutritionCards from "../components/NutritionCards";
import Screen from "../components/Screen";
import NavigationBar from "../components/NavigationBar";

function HomeScreen() {
	const [appIsReady, setAppIsReady] = useState(false);
	useEffect(() => {
		async function prepareApp() {
			try {
				await tf.ready();
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}
		prepareApp();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) return null;

	return (
		<Screen
			onLayout={onLayoutRootView}
			statusBarColor={colors.secondary_cinnamon}
			statusBarStyle="white"
		>
			<View style={styles.title_container}>
				<Text style={styles.title}>FoodNet</Text>
			</View>
			<View style={styles.content}>
				<Text style={styles.h1}>Today's Intake</Text>
				<View style={styles.nutrition_panel}>
					<NutritionCards
						name="Calorie"
						value="1200kcal"
						style={styles.nutrition_card}
					/>
					<NutritionCards
						name="Carbohydrate"
						value="1200g"
						style={styles.nutrition_card}
					/>
					<NutritionCards name="Protein" value="200g" />
					<NutritionCards name="Fat" value="69g" />
				</View>
				<NavigationBar style={styles.navigation_bar} />
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 27,
		fontWeight: "bold",
		color: colors.primary_white,
	},
	title_container: {
		backgroundColor: colors.secondary_cinnamon,
		padding: 10,
		alignItems: "center",
	},
	content: {
		flex: 1,
		padding: 15,
	},
	h1: {
		fontSize: 22,
		color: colors.primary_black,
		fontWeight: "500",
		alignSelf: "center",
		marginBottom: 15,
	},
	navigation_bar: {
		marginTop: "auto",
	},
	nutrition_panel: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	nutrition_card: {
		marginBottom: 15,
	},
});

export default HomeScreen;
