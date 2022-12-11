import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import DatePickerOption from "../components/DatePickerOption";
import ListEmptyComponent from "../components/ListEmptyComponent";
import ListItemSeparator from "../components/ListItemSeparator";
import RecentItem from "../components/RecentItem";
import Screen from "../components/Screen";
import WeeklyNutrientsChart from "../components/WeeklyNutrientsChart";
import colors from "../config/colors";
import useAppState from "../hooks/useAppState";
import { parseWeeklyNutrientsSum } from "../utils/charts";
import {
	selectEarliestDate,
	selectNutrientsSumBetweenDates,
	selectRecordsOnDate,
} from "../utils/database";
import {
	dateToString,
	generateDatesBetween,
	generateWeeklyDatesBetween,
	getStartOfWeek,
	stringToDate,
} from "../utils/datetime";

function StatsScreen() {
	const nutrientsDropdown = [
		{ label: "Calorie", value: 0 },
		{ label: "Carbs", value: 1 },
		{ label: "Protein", value: 2 },
		{ label: "Fat", value: 3 },
	];
	const [datePickerWeeklyRange, setDatePickerWeeklyRange] = useState([]);
	const [selectedWeek, setSelectedWeek] = useState(null);
	const [selectedNutrient, setSelectedNutrient] = useState(
		nutrientsDropdown[0]
	);
	const [datePickerDates, setDatePickerDates] = useState([]);
	const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
	const [weeklyData, setWeeklyData] = useState([]);
	const [chartsData, setChartsData] = useState([]);
	const [eatenFoodData, setEatenFoodData] = useState([]);
	const { storageLastUpdated, setError } = useAppState();

	useEffect(() => {
		selectEarliestDate()
			.then((result) => {
				let currentDate = new Date();
				let startDate =
					result.rows.length > 0
						? stringToDate(result.rows._array[0].date)
						: currentDate;
				startDate = getStartOfWeek(startDate);
				let range = generateWeeklyDatesBetween(startDate, currentDate);
				range = range.map((item) => {
					return { label: dateToString(item, 2), value: item };
				});
				setDatePickerWeeklyRange(range);
				setSelectedWeek(range[range.length - 1]);
			})
			.catch((error) => {
				setError(
					new Error(
						"SQLite Error : Unable to retrieve the earliest date.",
						{ cause: error }
					)
				);
			});
	}, []);
	useEffect(() => {
		if (!selectedWeek) return;
		let startDate = selectedWeek.value;
		let endDate = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate() + 6
		);
		selectNutrientsSumBetweenDates(
			dateToString(startDate),
			dateToString(endDate)
		)
			.then((result) => {
				return Promise.resolve(
					parseWeeklyNutrientsSum(result.rows._array)
				);
			})
			.then((weeklyNutrientsSum) => {
				let dates = generateDatesBetween(startDate, endDate);
				setDatePickerDates(dates);
				setSelectedDateIndex(0);
				setWeeklyData(weeklyNutrientsSum);
			})
			.catch((error) => {
				setError(
					new Error(
						"SQLite Error : Unable to retrieve the data for nutritions.",
						{ cause: error }
					)
				);
			});
	}, [selectedWeek]);

	useEffect(() => {
		if (datePickerDates.length === 0 || selectedDateIndex === -1) return;
		let selectedDate = datePickerDates[selectedDateIndex];
		selectRecordsOnDate(dateToString(selectedDate))
			.then((result) => {
				setEatenFoodData(result.rows._array);
			})
			.catch((error) => {
				setError(
					new Error(
						"SQLite Error : Unable to retrieve the eaten food.",
						{ cause: error }
					)
				);
			});
	}, [selectedWeek, selectedDateIndex, storageLastUpdated]);

	useEffect(() => {
		if (!weeklyData) return;
		setChartsData(weeklyData[selectedNutrient.label.toLowerCase()]);
	}, [weeklyData, selectedNutrient]);

	useEffect(() => {
		if (!storageLastUpdated || !selectedWeek) return;
		let today = new Date();
		let startOfWeek = getStartOfWeek(today);
		if (startOfWeek.getTime() !== selectedWeek.value.getTime()) return;
		let startDate = selectedWeek.value;
		let endDate = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate() + 6
		);
		selectNutrientsSumBetweenDates(
			dateToString(startDate),
			dateToString(endDate)
		)
			.then((result) => {
				return Promise.resolve(
					parseWeeklyNutrientsSum(result.rows._array)
				);
			})
			.then((weeklyNutrientsSum) => {
				setWeeklyData(weeklyNutrientsSum);
			})
			.catch((error) => {
				setError(
					new Error(
						"SQLite Error : Unable to retrieve the data for nutritions.",
						{ cause: error }
					)
				);
			});
	}, [storageLastUpdated]);
	return (
		<Screen statusBarColor={colors.primary_white}>
			<View style={styles.root}>
				<Text style={styles.h1_title}>
					{selectedWeek !== null
						? `Week of ${selectedWeek.label}`
						: ""}
				</Text>
				<View style={styles.dropdown_pickers_container}>
					<Dropdown
						data={datePickerWeeklyRange}
						labelField="label"
						valueField="value"
						value={selectedWeek}
						onChange={(selected) => setSelectedWeek(selected)}
						search
						searchPlaceholder="Search..."
						statusBarIsTranslucent={true}
						style={[styles.dropdown_picker, styles.week_picker]}
					/>
					<Dropdown
						data={nutrientsDropdown}
						labelField="label"
						valueField="value"
						value={selectedNutrient}
						onChange={(selected) => setSelectedNutrient(selected)}
						statusBarIsTranslucent={true}
						style={[styles.dropdown_picker, styles.nutrient_picker]}
					/>
				</View>
				<View style={styles.chart_container}>
					<WeeklyNutrientsChart data={chartsData} />
				</View>
				<View style={styles.date_picker}>
					<FlatList
						contentContainerStyle={{ flexGrow: 1 }}
						data={datePickerDates}
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
					/>
				</View>
				<View style={styles.eaten_food_container}>
					<FlatList
						contentContainerStyle={{ flexGrow: 1 }}
						data={eatenFoodData}
						renderItem={({ item }) => {
							return <RecentItem item={{ ...item }} />;
						}}
						ListHeaderComponent={
							<Text style={[styles.h1_title]}>Eaten Food</Text>
						}
						ListEmptyComponent={ListEmptyComponent}
						ItemSeparatorComponent={ListItemSeparator}
					/>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	chart_container: {
		flex: 1,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	h1_title: {
		fontWeight: "bold",
		fontSize: 22,
	},
	date_picker: {
		marginTop: 8,
		paddingBottom: 15,
	},
	dropdown_picker: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 5,
		paddingHorizontal: 10,
	},
	dropdown_pickers_container: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 15,
	},
	eaten_food_container: {
		flex: 1,
	},
	nutrient_picker: {
		width: "30%",
	},
	root: {
		padding: 15,
		flex: 1,
	},
	week_picker: {
		width: "60%",
	},
});

export default StatsScreen;
