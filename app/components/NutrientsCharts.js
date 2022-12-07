import React from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import colors from "../config/colors";

function NutrientsCharts({ data }) {
	// data = [{ value: 15 }, { value: 30 }, { value: 26 }, { value: 40 }];
	console.log(data);
	return (
		<View style={styles.root}>
			<LineChart data={data} curved />
		</View>
	);
}

const styles = StyleSheet.create({
	chart: {
		flex: 1,
	},
	root: {
		flex: 1,
	},
});

export default NutrientsCharts;
