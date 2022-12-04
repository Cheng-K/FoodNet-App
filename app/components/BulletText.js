import React from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function BulletText({ style, title }) {
	return (
		<Text style={[styles.root, style]}>
			{"\u25cf"} {title}
		</Text>
	);
}

const styles = StyleSheet.create({
	root: {
		color: colors.primary_black,
		fontWeight: "500",
		fontSize: 18,
		textTransform: "capitalize",
	},
});

export default BulletText;
