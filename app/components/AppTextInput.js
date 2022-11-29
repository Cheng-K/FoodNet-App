import React from "react";
import { StyleSheet, TextInput } from "react-native";
import colors from "../config/colors";

function AppTextInput({ hasError = false, width, ...props }) {
	return (
		<TextInput
			{...props}
			style={[styles.root, { width }, hasError ? styles.error : null]}
		/>
	);
}

const styles = StyleSheet.create({
	root: {
		backgroundColor: "white",
		borderRadius: 15,
		marginHorizontal: 10,
		padding: 5,
		paddingHorizontal: 10,
	},
	error: {
		borderWidth: 2,
		borderColor: colors.accent_red,
	},
});

export default AppTextInput;
