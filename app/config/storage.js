import * as FileSystem from "expo-file-system";

export default {
	model_release: "current_model_key",
	model_dir: FileSystem.documentDirectory + "assets/model",
	fetch_model_version_url:
		"https://api.github.com/repos/Cheng-K/FoodNet-Model/releases/latest",
	fetch_model_url:
		"https://github.com/Cheng-K/FoodNet-Model/releases/latest/download/model.json",
};
