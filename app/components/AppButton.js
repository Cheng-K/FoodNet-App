import React from "react";
import { Pressable, Text } from "react-native";

function AppButton({
	backgroundColor,
	color,
	IconComponent,
	onPress,
	title,
	...props
}) {
	return (
		<Pressable
			style={[styles.root, { backgroundColor }]}
			onPress={onPress}
			{...props}
		>
			{IconComponent}
			<Text style={[styles.text, { color }]}>{title}</Text>
		</Pressable>
	);
}

const styles = {
	root: {
		borderRadius: 15,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	text: {
		marginLeft: 10,
		fontWeight: "500",
		textTransform: "uppercase",
	},
};

export default AppButton;
