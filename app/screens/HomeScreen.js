import React, { useEffect, useReducer, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ListEmptyComponent from "../components/ListEmptyComponent";
import ListItemSeparator from "../components/ListItemSeparator";
import NutritionCards from "../components/NutritionCards";
import RecentItem from "../components/RecentItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAppState from "../hooks/useAppState";
import {
	selectLastKRecords,
	selectNutrientsSumFromToday,
} from "../utils/database";

function HomeScreen({ route }) {
	const { setError } = useAppState();
	const [recentIntakeList, setRecentIntakeList] = useState([]);
	const [todayNutrients, setTodayNutrients] = useState([]);
	const [flatListRerender, triggerFlatListRerender] = useReducer(
		(flatListRerender) => !flatListRerender,
		false
	);
	const updateIntakeList = async (newRecord) => {
		if (!newRecord) return;
		const newIntakeList = recentIntakeList;
		if (newIntakeList.length === 5) {
			newIntakeList.pop();
		}
		try {
			let result = await selectLastKRecords(1);
			console.log(result.rows._array);
			newIntakeList.unshift(result.rows._array[0]);
			setRecentIntakeList(newIntakeList);
			triggerFlatListRerender();
		} catch (error) {
			setError(error);
		}
	};
	const updateTodayNutrients = (newRecord) => {
		if (!newRecord) return;
		const newTodayNutrients = { ...todayNutrients };
		newTodayNutrients.calorie += newRecord.calorie;
		newTodayNutrients.carbs += newRecord.carbs;
		newTodayNutrients.protein += newRecord.protein;
		newTodayNutrients.fat += newRecord.fat;
		setTodayNutrients(newTodayNutrients);
	};
	const fetchRecentIntake = async () => {
		try {
			let result = await selectLastKRecords(5);
			console.log(result.rows._array);
			setRecentIntakeList(result.rows._array);
		} catch (error) {
			setError(error);
		}
	};
	const fetchTodayNutrient = async () => {
		try {
			let result = await selectNutrientsSumFromToday(0);
			console.log(result.rows._array);
			let value = result.rows._array[0];
			value = {
				calorie: value.sum_calorie ? value.sum_calorie : 0,
				carbs: value.sum_carbs ? value.sum_carbs : 0,
				protein: value.sum_protein ? value.sum_protein : 0,
				fat: value.sum_fat ? value.sum_fat : 0,
			};
			console.log(typeof value.calorie);
			setTodayNutrients(value);
		} catch (error) {
			setError(error);
		}
	};
	useEffect(() => {
		fetchRecentIntake();
		fetchTodayNutrient();
	}, []);
	useEffect(() => {
		console.log("update");
		updateIntakeList(route.params?.newRecord);
		updateTodayNutrients(route.params?.newRecord);
	}, [route.params?.newRecord]);
	return (
		<Screen
			statusBarColor={colors.secondary_cinnamon}
			statusBarStyle="inverted"
		>
			<View style={styles.title_container}>
				<Text style={styles.title}>FoodNet</Text>
			</View>
			<View style={styles.content}>
				<Text style={[styles.h1, styles.bottom_margin]}>
					Today's Intake
				</Text>
				<View style={styles.nutrition_panel}>
					<NutritionCards
						name="Calorie"
						value={`${todayNutrients.calorie?.toFixed(2)}kcal`}
						style={styles.bottom_margin}
					/>
					<NutritionCards
						name="Carbohydrate"
						value={`${todayNutrients.carbs?.toFixed(2)}g`}
						style={styles.bottom_margin}
					/>
					<NutritionCards
						name="Protein"
						value={`${todayNutrients.protein?.toFixed(2)}g`}
					/>
					<NutritionCards
						name="Fat"
						value={`${todayNutrients.fat?.toFixed(2)}g`}
					/>
				</View>
				<View style={styles.flex_container}>
					<Text style={[styles.h1, styles.h1_top_margin]}>
						Recent Intake
					</Text>
					<FlatList
						contentContainerStyle={{ flexGrow: 1 }}
						data={recentIntakeList}
						extraData={flatListRerender}
						renderItem={({ item }) => {
							return <RecentItem item={{ ...item }} />;
						}}
						ListEmptyComponent={ListEmptyComponent}
						ItemSeparatorComponent={ListItemSeparator}
					/>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 15,
	},
	flex_container: {
		flex: 1,
	},
	h1: {
		fontSize: 22,
		color: colors.primary_black,
		fontWeight: "500",
		alignSelf: "center",
	},
	bottom_margin: {
		marginBottom: 15,
	},
	h1_top_margin: {
		marginTop: 20,
	},
	nutrition_panel: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 27,
		fontWeight: "bold",
		color: colors.primary_white,
	},
	title_container: {
		backgroundColor: colors.secondary_cinnamon,
		padding: 10,
		alignItems: "center",
	},
});

export default HomeScreen;
