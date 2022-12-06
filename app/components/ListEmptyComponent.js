import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

function ListEmptyComponent() {
	return (
		<View style={styles.root}>
			<Text style={styles.text}>No data available</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	text: {
		fontWeight: "600",
		color: colors.secondary_grey,
	},
});

export default ListEmptyComponent;
