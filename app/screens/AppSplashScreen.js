import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Screen from "../components/Screen";
import colors from "../config/colors";

function AppSplashScreen() {
	return (
		<Screen
			statusBarColor={colors.secondary_cinnamon}
			statusBarStyle="inverted"
			style={styles.root}
		>
			<View style={styles.title_container}>
				<Text style={styles.title}>FoodNet</Text>
			</View>
			<View style={styles.cooking_splash_container}>
				<LottieView
					autoPlay
					style={styles.cooking_splash}
					source={require("../assets/cooking-splash.json")}
				/>
			</View>
			<View>
				<Text style={styles.text}>
					Loading... This might take a while...
				</Text>
			</View>
			<View style={styles.loading_splash_container}>
				<LottieView
					autoPlay
					source={require("../assets/loading-splash.json")}
					style={styles.loading_splash}
					colorFilters={[
						{
							keypath: "Shape Layer 1",
							color: colors.primary_white,
						},
						{
							keypath: "Shape Layer 2",
							color: colors.primary_white,
						},
						{
							keypath: "Shape Layer 3",
							color: colors.primary_white,
						},
						{
							keypath: "Shape Layer 4",
							color: colors.primary_white,
						},
						{
							keypath: "Shape Layer 5",
							color: colors.primary_white,
						},
					]}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	root: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.secondary_cinnamon,
	},
	title: {
		color: colors.primary_white,
		fontWeight: "bold",
		fontSize: 34,
		textAlign: "center",
	},
	text: {
		color: colors.primary_white,
		fontSize: 18,
		textAlign: "center",
	},
	cooking_splash_container: {
		backgroundColor: colors.secondary_cinnamon,
		alignItems: "center",
		justifyContent: "center",
		flex: 0.9,
	},
	title_container: {
		width: "100%",
		height: "15%",
		justifyContent: "center",
	},
	cooking_splash: {
		width: 320,
		height: 320,
	},
	loading_splash: {
		width: 100,
		height: 100,
	},
	loading_splash_container: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: 85,
	},
});

export default AppSplashScreen;
