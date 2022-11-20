import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

function NutritionCards({ name, value, style }) {
	return (
		<View style={[styles.root, style]}>
			<Text style={styles.name}>{name}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		borderColor: colors.secondary_grey,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		width: 160,
		height: 103,
		borderRadius: 15,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.primary_black,
		marginBottom: 10,
	},
	value: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.secondary_cinnamon,
	},
});

export default NutritionCards;
