import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import colors from "../config/colors";

function NavigationButton({ highlighted, icon, name, onSelect, style }) {
	return (
		<TouchableWithoutFeedback>
			<View style={[styles.root, style]}>
				{icon}
				<Text>{name}</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	name: {
		fontSize: 14,
		color: colors.secondary_grey,
	},
});

export default NavigationButton;
