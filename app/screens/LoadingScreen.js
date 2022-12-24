import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

import Screen from "../components/Screen";
import colors from "../config/colors";

function LoadingScreen() {
	return (
		<Screen style={styles.root}>
			<View>
				<Text style={styles.text}>Loading...</Text>
			</View>
			<LottieView
				autoPlay
				style={styles.loading}
				source={require("../assets/loading-screen.json")}
				colorFilters={[
					{
						keypath: "Shape Layer 1",
						color: colors.secondary_cinnamon,
					},
					{
						keypath: "Shape Layer 2",
						color: colors.secondary_cinnamon,
					},
					{
						keypath: "Shape Layer 3",
						color: colors.secondary_cinnamon,
					},
					{
						keypath: "Shape Layer 4",
						color: colors.secondary_cinnamon,
					},
					{
						keypath: "Shape Layer 5",
						color: colors.secondary_cinnamon,
					},
				]}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	root: {
		backgroundColor: colors.primary_white,
		justifyContent: "center",
		alignItems: "center",
	},
	loading: {
		width: 300,
		height: 300,
	},
	text: {
		fontWeight: "500",
		fontSize: 18,
	},
});

export default LoadingScreen;
