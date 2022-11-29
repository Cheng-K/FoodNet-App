import React from "react";
import { Text } from "react-native";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Screen from "../components/Screen";
import colors from "../config/colors";

function StatsScreen() {
	setStatusBarBackgroundColor(colors.primary_white);
	return (
		<Screen statusBarColor={colors.primary_white}>
			<Text>Welcome to the Statistics Screen</Text>
		</Screen>
	);
}

export default StatsScreen;
