import React, { useState, useEffect, useRef } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import DatePickerOption from "../components/DatePickerOption";
import NutrientsCharts from "../components/NutrientsCharts";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAppState from "../hooks/useAppState";
import { processData } from "../utils/charts";
import { selectEarliestDate, selectNutrientsOnDate } from "../utils/database";
import {
	dateToString,
	formatString,
	generateDatesBetween,
} from "../utils/datetime";

function StatsScreen() {
	const [datePickerRange, setDatePickerRange] = useState(null);
	const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
	const [data, setData] = useState([]);
	const { setError } = useAppState();
	const datePickerScroller = useRef(null);
	useEffect(() => {
		selectEarliestDate()
			.then((result) => {
				let currentDate = Date.now();
				let startDate = formatString(result.rows._array[0].date);
				let range = generateDatesBetween(startDate, currentDate);
				setDatePickerRange(range);
				setSelectedDateIndex(range.length - 1);
			})
			.catch((error) => {
				setError(error);
			});
	}, []);
	useEffect(() => {
		if (!datePickerRange) return;
		datePickerScroller.current.scrollToEnd();
	}, [datePickerRange]);
	useEffect(() => {
		if (!datePickerRange) return;
		selectNutrientsOnDate(dateToString(datePickerRange[selectedDateIndex]))
			.then((result) => {
				let processed = processData(result.rows._array);
				console.log(processed);
				setData(processed);
			})
			.catch((error) => setError(error));
	}, [selectedDateIndex]);
	return (
		<Screen statusBarColor={colors.primary_white}>
			<ScrollView style={styles.root}>
				<Text style={styles.date_title}>
					{selectedDateIndex !== -1
						? dateToString(datePickerRange[selectedDateIndex], 2)
						: ""}
				</Text>
				<View style={styles.date_picker}>
					<FlatList
						contentContainerStyle={{ flexGrow: 1 }}
						data={datePickerRange}
						renderItem={({ item, index }) => {
							return (
								<DatePickerOption
									date={item}
									selected={selectedDateIndex === index}
									onPress={() => setSelectedDateIndex(index)}
								/>
							);
						}}
						horizontal={true}
						ref={datePickerScroller}
					/>
				</View>
				<View>
					<FlatList
						contentContainerStyle={{ flexGrow: 1 }}
						data={data}
						renderItem={({ item, index }) => {
							return <NutrientsCharts data={item} />;
						}}
					/>
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	date_title: {
		fontWeight: "bold",
		fontSize: 22,
		// textAlign: "center",
	},
	date_picker: {
		marginTop: 20,
	},
	root: {
		padding: 15,
	},
});

export default StatsScreen;
