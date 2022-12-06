import {
	FontAwesome5,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	ToastAndroid,
	View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import BulletText from "../components/BulletText";
import IconText from "../components/IconText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAppState from "../hooks/useAppState";
import useMountedModel from "../hooks/useMountedModel";
import LoadingScreen from "./LoadingScreen";
import { insertRecords } from "../services/database";

function NutritionDetails({
	portion,
	setPortion,
	portionInput,
	setPortionInput,
	portionInputError,
	setPortionInputError,
}) {
	const { predictedResult } = useMountedModel();
	const slider = useRef(null);
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
							setPortion(Number(portionInput));
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
						setPortion(value);
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
					style={[
						nutritionDetails.results,
						nutritionDetails.results_align_left,
					]}
					title={`${(predictedResult.calorieOutput * portion).toFixed(
						2
					)}kcal`}
				/>
				<IconText
					IconComponent={
						<MaterialCommunityIcons
							name="noodles"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={[
						nutritionDetails.results,
						nutritionDetails.results_align_right,
					]}
					title={`${(predictedResult.carbsOutput * portion).toFixed(
						2
					)}g carbs`}
				/>
				<IconText
					IconComponent={
						<FontAwesome5
							name="fish"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={[
						nutritionDetails.results,
						nutritionDetails.results_align_left,
					]}
					title={`${(predictedResult.proteinOutput * portion).toFixed(
						2
					)}g protein`}
				/>
				<IconText
					IconComponent={
						<FontAwesome5
							name="pizza-slice"
							size={25}
							color={colors.primary_white}
						/>
					}
					style={[
						nutritionDetails.results,
						nutritionDetails.results_align_right,
					]}
					title={`${(predictedResult.fatOutput * portion).toFixed(
						2
					)}g fat`}
				/>
			</View>
		</View>
	);
}

function IngredientsDetails({ ingredientsList }) {
	const renderListItem = ({ item }) => {
		return <BulletText style={ingredientsDetails.text} title={item} />;
	};
	return (
		<FlatList
			style={ingredientsDetails.root}
			data={ingredientsList}
			renderItem={renderListItem}
		/>
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
				onPress={() => onPress("Nutrition")}
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
				onPress={() => onPress("Ingredients")}
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

function ResultsScreen({ navigation, route }) {
	const { setError } = useAppState();
	const { modelIsRunning, predictedResult, runInference } = useMountedModel();
	const [currentSelected, setSelected] = useState("Nutrition");
	const [portion, setPortion] = useState(500);
	const [portionInput, setPortionInput] = useState(portion.toString());
	const [portionInputError, setPortionInputError] = useState(null);
	const { imageUri, imageBase64 } = route.params;

	const saveImage = async (uri) => {
		const mediaLibraryPermission =
			await MediaLibrary.requestPermissionsAsync();
		if (mediaLibraryPermission.accessPrivileges === "none") {
			Alert.alert(
				"Permisions Denied",
				"FoodNet requires media library permissions to save images.",
				[
					{
						text: "Go to Settings",
						onPress: () => Linking.openSettings(),
					},
					{
						text: "CANCEL",
					},
				]
			);
		} else {
			try {
				let [storageAlbum, imageAsset] = await Promise.all([
					MediaLibrary.getAlbumAsync("foodnet"),
					MediaLibrary.createAssetAsync(uri),
				]);
				if (storageAlbum == null) {
					storageAlbum = await MediaLibrary.createAlbumAsync(
						"foodnet",
						imageAsset,
						false
					);
				} else {
					await MediaLibrary.addAssetsToAlbumAsync(
						imageAsset,
						storageAlbum,
						false
					);
				}
				const latestImage = (
					await MediaLibrary.getAssetsAsync({
						album: storageAlbum,
						sortBy: "creationTime",
						first: 1,
					})
				).assets[0];
				return latestImage.uri;
			} catch (error) {
				throw error;
			}
		}
	};

	const onSave = async (uri) => {
		try {
			let imageUri = await saveImage(uri);
			const values = {
				file_uri: imageUri,
				category: predictedResult.categoryOutput,
				ingredients: predictedResult.ingredientsOutput.toString(),
				calorie: predictedResult.calorieOutput * portion,
				carbs: predictedResult.carbsOutput * portion,
				protein: predictedResult.proteinOutput * portion,
				fat: predictedResult.fatOutput * portion,
			};
			await insertRecords(values);
			ToastAndroid.show("Image saved successfully", ToastAndroid.SHORT);
			navigation.navigate("HomeStack", {
				screen: "Home",
				params: { newRecord: values },
			});
		} catch (error) {
			setError(error);
		}
	};

	useEffect(() => {
		setTimeout(() => runInference(imageBase64), 0);
	}, []);

	if (modelIsRunning) return <LoadingScreen />;
	return (
		<Screen statusBarColor={colors.primary_white}>
			<View style={styles.img_container}>
				<Image
					style={styles.img}
					resizeMode="contain"
					source={{ uri: imageUri }}
				/>
			</View>
			<View style={styles.details_container}>
				<Text style={styles.title}>
					{predictedResult.categoryOutput}
				</Text>
				<ResultsNavigation
					currentSelected={currentSelected}
					onPress={setSelected}
				/>
				{currentSelected === "Nutrition" && (
					<NutritionDetails
						portion={portion}
						setPortion={setPortion}
						portionInput={portionInput}
						setPortionInput={setPortionInput}
						portionInputError={portionInputError}
						setPortionInputError={setPortionInputError}
					/>
				)}
				{currentSelected === "Ingredients" && (
					<IngredientsDetails
						ingredientsList={predictedResult.ingredientsOutput}
					/>
				)}
				<View style={styles.button_container}>
					<AppButton
						backgroundColor={colors.accent_green}
						color={colors.primary_white}
						disabled={portionInputError !== null}
						style={styles.button}
						title="Save"
						IconComponent={
							<MaterialIcons
								name="save"
								size={24}
								color={colors.primary_white}
							/>
						}
						onPress={() => onSave(imageUri)}
					/>
					<AppButton
						backgroundColor={colors.accent_red}
						color={colors.primary_white}
						style={styles.button}
						title="Discard"
						IconComponent={
							<MaterialIcons
								name="delete"
								size={24}
								color={colors.primary_white}
							/>
						}
						onPress={() => navigation.navigate("HomeStack")}
					/>
				</View>
			</View>
		</Screen>
	);
}

const ingredientsDetails = StyleSheet.create({
	root: {
		paddingHorizontal: 30,
		paddingVertical: 15,
		textAlign: "justify",
		flex: 1,
	},
	text: {
		marginBottom: 3,
	},
});

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
		flex: 1,
	},
	results_container: {
		flexDirection: "row",
		width: "100%",
		flexWrap: "wrap",
		marginTop: 25,
	},
	results: {
		width: "50%",
		marginBottom: "5%",
	},
	results_align_right: {
		right: -30,
	},
	results_align_left: {
		right: -10,
	},
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
	button_container: {
		flexDirection: "row",
		justifyContent: "space-around",
		height: "15%",
	},
	button: {
		width: 139,
		height: 44,
	},
	details_container: {
		flex: 1,
		marginTop: 15,
	},
	img: {
		height: "100%",
		width: "100%",
	},
	img_container: {
		width: "100%",
		height: "38%",
	},
	title: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 24,
		textTransform: "capitalize",
	},
});

export default ResultsScreen;
