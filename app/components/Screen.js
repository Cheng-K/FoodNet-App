import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import colors from "../config/colors";

function Screen({
	children,
	onLayout,
	statusBarStyle = "dark",
	statusBarColor = colors.primary_white,
	statusBarHidden = false,
	style,
}) {
	return (
		<SafeAreaView onLayout={onLayout} style={[styles.root, style]}>
			{children}
			<StatusBar
				style={statusBarStyle}
				backgroundColor={statusBarColor}
				hidden={statusBarHidden}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: colors.primary_white,
	},
});

export default Screen;
