import {
	FontAwesome5,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useReducer, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import AppTextInput from "../components/AppTextInput";
import IconText from "../components/IconText";
import Screen from "../components/Screen";
import colors from "../config/colors";

function NutritionDetails({ portion, onPortionChange }) {
	const slider = useRef(null);
	const [portionInput, setPortionInput] = useState(portion.toString());
	const [portionInputError, setPortionInputError] = useState(null);
	const isNumeric = (text) => {
		text = text.trim();
		const regexp = /^([0-9]*[.])?[0-9]+$/g;
		return text.match(regexp) !== null;
	};
	return (
		<View style={nutritionDetails.root}>
			<View style={nutritionDetails.portion_input_container}>
				<Text>Portion (g) : </Text>
				<AppTextInput
					hasError={portionInputError !== null}
					width={100}
					inputMode="decimal"
					keyboardType="decimal-pad"
					value={portionInput}
					onChangeText={(text) => {
						setPortionInput(text);
					}}
					onBlur={() => {
						if (isNumeric(portionInput)) {
							onPortionChange(Number(portionInput));
							setPortionInput(Number(portionInput).toString());
							setPortionInputError(null);
						} else if (portionInput === "") {
							setPortionInputError("Value cannot be empty.");
						} else {
							setPortionInputError("Invalid portion value.");
						}
					}}
					maxLength={7}
				/>
				{portionInputError && (
					<>
						<MaterialIcons
							name="error-outline"
							size={24}
							color={colors.accent_red}
						/>
						<Text style={nutritionDetails.error}>
							{portionInputError}
						</Text>
					</>
				)}
			</View>
			<View>
				<Text>Predefined Portion : </Text>
				<View style={nutritionDetails.slider_header_container}>
					<Text
						style={[
							nutritionDetails.slider_header,
							nutritionDetails.slider_header_active,
						]}
					>
						Small
					</Text>
					<Text
						style={[
							nutritionDetails.slider_header,
							portion >= 500
								? nutritionDetails.slider_header_active
								: null,
						]}
					>
						Medium
					</Text>
					<Text
						style={[
							nutritionDetails.slider_header,
							portion >= 750
								? nutritionDetails.slider_header_active
								: null,
						]}
					>
						Large
					</Text>
				</View>
				<Slider
					style={nutritionDetails.slider}
					minimumValue={250}
					maximumValue={750}
					minimumTrackTintColor={colors.secondary_cinnamon}
					onValueChange={(value) => {
						onPortionChange(value);
						setPortionInput(value.toString());
						setPortionInputError(null);
					}}
					step={125}
					thumbTintColor={colors.secondary_cinnamon}
					value={portion}
					ref={slider}
				/>
			</View>
			<View style={nutritionDetails.results_container}>
				<IconText
					IconComponent={
						<MaterialIcons
							name="local-fire-department"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={nutritionDetails.results}
					title="100kcal"
				/>
				<IconText
					IconComponent={
						<MaterialCommunityIcons
							name="noodles"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={nutritionDetails.results}
					title="100g carbs"
				/>
				<IconText
					IconComponent={
						<FontAwesome5
							name="fish"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={nutritionDetails.results}
					title="100g protein"
				/>
				<IconText
					IconComponent={
						<FontAwesome5
							name="pizza-slice"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={nutritionDetails.results}
					title="100g fat"
				/>
			</View>
		</View>
	);
}

function ResultsNavigation({ currentSelected, onPress }) {
	const isNutritionSelected = currentSelected === "Nutrition";
	const isIngredientsSelected = currentSelected === "Ingredients";
	return (
		<View style={resultsNavigation.root}>
			<Pressable
				style={[
					resultsNavigation.selection,
					isNutritionSelected ? resultsNavigation.selected : null,
				]}
				onPress={onPress}
			>
				<Text
					style={[
						resultsNavigation.selection_text,
						isNutritionSelected
							? resultsNavigation.selected_text
							: null,
					]}
				>
					Nutrition
				</Text>
			</Pressable>
			<Pressable
				style={[
					resultsNavigation.selection,
					isIngredientsSelected ? resultsNavigation.selected : null,
				]}
				onPress={onPress}
			>
				<Text
					style={[
						resultsNavigation.selection_text,
						isIngredientsSelected
							? resultsNavigation.selected_text
							: null,
					]}
				>
					Ingredients
				</Text>
			</Pressable>
		</View>
	);
}

function ResultsScreen({ imageUri = require("../assets/test-bibimbap.jpg") }) {
	const [currentSelected, toggleSelected] = useReducer(
		(currentSelected) =>
			currentSelected === "Nutrition" ? "Ingredients" : "Nutrition",
		"Nutrition"
	);
	const [portion, setPortion] = useState(500);

	return (
		<Screen statusBarColor={colors.primary_white}>
			<View style={styles.img_container}>
				<Image
					style={styles.img}
					resizeMode="cover"
					source={imageUri}
				/>
			</View>
			<View>
				<Text style={styles.title}>Bibimbap</Text>
				<ResultsNavigation
					currentSelected={currentSelected}
					onPress={toggleSelected}
				/>
				{currentSelected === "Nutrition" && (
					<NutritionDetails
						portion={portion}
						onPortionChange={setPortion}
					/>
				)}
			</View>
		</Screen>
	);
}

const resultsNavigation = StyleSheet.create({
	root: {
		flexDirection: "row",
	},
	selection: {
		width: "50%",
		borderBottomColor: colors.secondary_grey,
		borderBottomWidth: 1,
		padding: 10,
	},
	selection_text: {
		textAlign: "center",
		color: colors.secondary_grey,
		fontWeight: "600",
	},
	selected: {
		borderBottomColor: colors.secondary_cinnamon,
		borderBottomWidth: 2,
	},
	selected_text: {
		color: colors.secondary_cinnamon,
	},
});

const nutritionDetails = StyleSheet.create({
	error: {
		color: colors.accent_red,
		fontWeight: "600",
		paddingLeft: 3,
	},
	portion_input_container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginBottom: 10,
	},
	root: {
		padding: 15,
	},
	results_container: {
		flexDirection: "row",
		width: "100%",
		flexWrap: "wrap",
		marginTop: 25,
	},
	results: { width: "50%", marginBottom: 25, right: -20 },
	slider: {
		width: "100%",
		height: 30,
	},
	slider_header: {
		color: colors.secondary_grey,
		fontWeight: "600",
	},
	slider_header_active: {
		color: colors.secondary_cinnamon,
	},
	slider_header_container: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
});

const styles = StyleSheet.create({
	img: {
		height: "100%",
		width: "100%",
	},
	img_container: {
		width: "100%",
		height: "35%",
		borderRadius: 15,
	},
	title: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 24,
	},
});

export default ResultsScreen;
