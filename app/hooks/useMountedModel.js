import * as tf from "@tensorflow/tfjs";
import * as tf_rn from "@tensorflow/tfjs-react-native";
import { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateProvider";

function useMountedModel() {
	const {
		mountedModel,
		modelIsRunning,
		setModelIsRunning,
		predictedResult,
		setPredictedResult,
	} = useContext(AppStateContext);

	const getImageTensor = (base64ImageString) => {
		const bytes = tf.util.encodeString(base64ImageString, "base64");
		let imageTensor = tf_rn.decodeJpeg(bytes);
		imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
		imageTensor = tf.reshape(imageTensor, [-1, 224, 224, 3]);
		return imageTensor;
	};
	const inferImage = (imageTensor) => {
		let [
			categoryOutput,
			ingredientsOutput,
			calorieOutput,
			carbsOutput,
			proteinOutput,
			fatOutput,
		] = mountedModel.execute(imageTensor, [
			"category_output",
			"ingredients_output",
			"calorie_output",
			"carbs_output",
			"protein_output",
			"fat_output",
		]);
		categoryOutput = decodeCategoryPrediction(categoryOutput);
		ingredientsOutput = decodeIngredientsPrediction(ingredientsOutput);
		calorieOutput = decodeNutrientsPrediction(calorieOutput);
		carbsOutput = decodeNutrientsPrediction(carbsOutput);
		proteinOutput = decodeNutrientsPrediction(proteinOutput);
		fatOutput = decodeNutrientsPrediction(fatOutput);
		return {
			categoryOutput,
			ingredientsOutput,
			calorieOutput,
			carbsOutput,
			proteinOutput,
			fatOutput,
		};
	};

	const decodeCategoryPrediction = (resultTensor) => {
		const encodedCategories = require("../assets/encoded_food_categories.json");
		resultTensor = resultTensor.reshape([-1]);
		let index = tf.argMax(resultTensor);
		index = index.arraySync();
		const categories = Object.keys(encodedCategories);
		return categories[index].replace(/[_]/g, " ");
	};

	const decodeIngredientsPrediction = (resultTensor) => {
		const encodedIngredients = require("../assets/encoded_ingredients.json");
		resultTensor = resultTensor.reshape([-1]);
		let { values, indices } = tf.topk(resultTensor, 8, true);
		indices = indices.arraySync();
		const ingredients = Object.keys(encodedIngredients);
		return indices.map((i) => ingredients[i]);
	};

	const decodeNutrientsPrediction = (resultTensor) => {
		resultTensor = resultTensor.reshape([-1]);
		let value = resultTensor.arraySync();
		return Math.abs(value[0]);
	};

	const runInference = (imageBase64) => {
		let imageTensor = getImageTensor(imageBase64);
		const result = inferImage(imageTensor);
		console.log(result);
		setPredictedResult(result);
		setModelIsRunning(false);
	};

	return {
		mountedModel,
		modelIsRunning,
		setModelIsRunning,
		predictedResult,
		runInference,
	};
}

export default useMountedModel;
