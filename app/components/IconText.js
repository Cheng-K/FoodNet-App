import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

function IconText({
	IconComponent,
	style,
	title,
	iconContainerStyle,
	titleStyle,
	numberOfLines = 0,
}) {
	return (
		<View style={[styles.root, style]}>
			<View style={[styles.icon_container, iconContainerStyle]}>
				{IconComponent}
			</View>
			<Text
				style={[styles.title, titleStyle]}
				numberOfLines={numberOfLines}
			>
				{title}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	icon_container: {
		backgroundColor: colors.secondary_cinnamon,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		height: 42,
		width: 42,
		marginRight: 10,
	},
	root: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	title: {
		fontWeight: "600",
		color: colors.primary_black,
		fontSize: 16,
	},
});

export default IconText;
