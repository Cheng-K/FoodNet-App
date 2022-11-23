import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

import NavigationBar from "../components/NavigationBar";
import NutritionCards from "../components/NutritionCards";
import Screen from "../components/Screen";
import colors from "../config/colors";

function HomeScreen() {
	const [appIsReady, setAppIsReady] = useState(false);
	const [scanModalVisible, toggleScanModalVisibility] = useReducer(
		(scanModalVisible) => !scanModalVisible,
		false
	);
	const [homeIsSelected, setHomeIsSelected] = useState(true);
	const [statsIsSelected, setStatsIsSelected] = useState(false);
	const [currentSelected, changeCurrentSelected] = useReducer(
		(currentSelected, newSelected) => {
			if (newSelected === "home") {
				setHomeIsSelected(true);
				setStatsIsSelected(false);
			} else if (newSelected === "stats") {
				setStatsIsSelected(true);
				setHomeIsSelected(false);
			}
		},
		"home"
	);

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
			statusBarStyle="inverted"
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
				<NavigationBar
					style={styles.navigation_bar}
					isHomeSelected={homeIsSelected}
					isStatsSelected={statsIsSelected}
					onHomeSelect={() => changeCurrentSelected("home")}
					onStatsSelect={() => changeCurrentSelected("stats")}
					onCameraSelect={toggleScanModalVisibility}
				/>
				<Modal
					visible={scanModalVisible}
					animationType="slide"
					transparent
				>
					<View style={styles.scan_modal_container}>
						<View style={styles.scan_modal}>
							<View style={styles.scan_modal_btn}>
								<Button
									color={colors.secondary_cinnamon}
									title="Scan with camera"
								/>
							</View>
							<View style={styles.scan_modal_btn}>
								<Button
									color={colors.secondary_cinnamon}
									title="Choose from gallery"
								/>
							</View>
							<View style={styles.scan_modal_btn}>
								<Button
									color={colors.accent_red}
									title="Close"
									onPress={toggleScanModalVisibility}
								/>
							</View>
						</View>
					</View>
				</Modal>
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
	scan_modal: {
		width: "100%",
		height: "30%",
		backgroundColor: colors.primary_white,
		borderRadius: 15,
		justifyContent: "space-around",
		padding: 15,
	},
	scan_modal_btn: {
		marginTop: 20,
	},
	scan_modal_container: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.8)",
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
