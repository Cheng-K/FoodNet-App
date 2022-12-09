import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function DatePickerOption({ date, selected, onPress }) {
	return (
		<Pressable
			style={[styles.root, selected ? styles.selected_root : null]}
			onPress={onPress}
		>
			<Text
				style={[
					styles.day_text,
					selected ? styles.selected_text : null,
				]}
			>
				{date.getDay() === 0
					? "Sun"
					: date.getDay() === 1
					? "Mon"
					: date.getDay() === 2
					? "Tue"
					: date.getDay() === 3
					? "Wed"
					: date.getDay() === 4
					? "Thu"
					: date.getDay() === 5
					? "Fri"
					: "Sat"}
			</Text>
			<Text
				style={[
					styles.date_text,
					selected ? styles.selected_text : null,
				]}
			>
				{date.getDate()}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	date_text: {
		textAlign: "center",
		fontWeight: "500",
		color: colors.primary_black,
		fontSize: 16,
	},
	day_text: {
		textAlign: "center",
		fontWeight: "regular",
		color: colors.primary_black,
		fontSize: 16,
	},
	root: {
		justifyContent: "space-around",
		backgroundColor: colors.pure_white,
		borderRadius: 10,
		width: 58,
		height: 63,
		padding: 10,
		marginRight: 12,
	},
	selected_text: {
		color: colors.primary_white,
	},
	selected_root: {
		backgroundColor: colors.secondary_cinnamon,
	},
});

export default DatePickerOption;
