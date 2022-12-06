import React from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "../config/colors";
import FocusAwareStatusBar from "./FocusAwareStatusBar";

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
			<FocusAwareStatusBar
				backgroundColor={statusBarColor}
				style={statusBarStyle}
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
