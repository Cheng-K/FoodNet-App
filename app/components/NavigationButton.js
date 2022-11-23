import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import colors from "../config/colors";

function NavigationButton({ highlighted, icon, main, name, onSelect, style }) {
	return (
		<TouchableWithoutFeedback onPress={onSelect}>
			<View style={[styles.root, style]}>
				<View style={main ? styles.circle : {}}>{icon}</View>
				<Text
					style={[styles.name, highlighted ? styles.highlighted : {}]}
				>
					{name}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	circle: {
		width: 42,
		height: 42,
		borderRadius: 42 / 2,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.secondary_cinnamon,
		padding: 5,
		marginBottom: 3,
	},
	root: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	name: {
		fontSize: 14,
		color: colors.secondary_grey,
	},
	highlighted: {
		color: colors.secondary_cinnamon,
		fontWeight: "bold",
	},
});

export default NavigationButton;
