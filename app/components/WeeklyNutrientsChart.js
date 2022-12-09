import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import colors from "../config/colors";

function WeeklyNutrientsChart({ data }) {
	return (
		<BarChart
			data={data}
			disableScroll={true}
			isAnimated={true}
			initialSpacing={13}
			leftShiftForLastIndexTooltip={13}
			noOfSections={5}
			renderTooltip={(item, index) => {
				return (
					<Text style={styles.tooltip}>{item.value.toFixed(0)}</Text>
				);
			}}
			xAxisColor={colors.primary_black}
			yAxisColor={colors.primary_black}
			xAxisThickness={0}
			yAxisLabelWidth={45}
			yAxisThickness={0}
		/>
	);
}

const styles = StyleSheet.create({
	tooltip: {
		marginBottom: 5,
		fontWeight: "600",
	},
});

export default WeeklyNutrientsChart;
