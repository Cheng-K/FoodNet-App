import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

function ListItemSeparator() {
	return <View style={styles.root} />;
}

const styles = StyleSheet.create({
	root: {
		borderColor: colors.secondary_grey,
		borderWidth: 0.3,
		backgroundColor: colors.secondary_grey,
	},
});

export default ListItemSeparator;
