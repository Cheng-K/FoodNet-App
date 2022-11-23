import * as MediaLibrary from "expo-media-library";
import { Camera, FlashMode } from "expo-camera";
import React, { useRef, useReducer, useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";

function CameraScreen() {
	const [cameraPermission, setCameraPermission] = useState();
	const [mediaLibraryPermission, setMediaLibraryPermission] = useState();
	const [previewImageUri, setPreviewImageUri] = useState();
	const [flashMode, toggleFlashMode] = useReducer(
		(flashMode) =>
			flashMode === "off" ? "on" : flashMode === "on" ? "auto" : "off",
		"off"
	);

	useEffect(() => {
		const fn = async () => {
			const cameraPermission =
				await Camera.requestCameraPermissionsAsync();
			const mediaLibraryPermission =
				await MediaLibrary.requestPermissionsAsync();

			setCameraPermission(cameraPermission);
			setMediaLibraryPermission(mediaLibraryPermission);

			if (mediaLibraryPermission.granted) {
				let getGalleryPreview = await MediaLibrary.getAssetsAsync();
				console.log(getGalleryPreview.assets[0].uri);
				setPreviewImageUri(getGalleryPreview.assets[0].uri);
			}
		};
		fn();
	}, []);

	const camera = useRef(null);

	if (!cameraPermission || !mediaLibraryPermission) return null;

	if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
		return (
			<Screen style={styles.info_container}>
				<MaterialIcons
					name="error-outline"
					size={20}
					color={colors.accent_red}
				/>
				<Text style={styles.info}>
					FoodNet requires camera and media library permissions for
					its scan camera to work. Please enable it in settings.
				</Text>
			</Screen>
		);
	}

	return (
		<Screen statusBarHidden={true} style={{ backgroundColor: "black" }}>
			<View style={styles.info_container}>
				<MaterialIcons
					name="info-outline"
					size={20}
					color={colors.accent_red}
				/>
				<Text style={styles.info}>
					Position one dish at the center of the camera.
				</Text>
			</View>
			<Camera
				style={styles.camera}
				ref={camera}
				ratio="16:9"
				flashMode={FlashMode[flashMode]}
			/>
			<View style={styles.shutter_panel}>
				<View style={styles.shutter_component_container}>
					<TouchableOpacity onPress={toggleFlashMode}>
						<MaterialIcons
							name={`flash-${flashMode}`}
							size={30}
							color={colors.primary_white}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.shutter_component_container}>
					<TouchableOpacity
						style={styles.shutter_btn}
						onPress={async () => {
							console.log(
								await camera.current.takePictureAsync()
							);
						}}
					/>
				</View>
				<View style={styles.shutter_component_container}>
					<TouchableOpacity
						onPress={() => {
							console.log("Gallery button tapped.");
						}}
					>
						<View>
							{previewImageUri && (
								<Image
									source={{ uri: previewImageUri }}
									style={styles.shutter_gallery}
								/>
							)}
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
	},
	info: {
		marginLeft: 5,
		color: colors.accent_red,
		fontWeight: "bold",
		textAlign: "justify",
	},
	info_container: {
		padding: 10,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	root: {
		justifyContent: "center",
		alignItems: "center",
	},
	shutter_btn: {
		height: 70,
		width: 70,
		backgroundColor: colors.primary_white,
		borderRadius: 64 / 2,
	},
	shutter_component_container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	shutter_gallery: {
		height: 60,
		width: 60,
		borderRadius: 10,
	},
	shutter_panel: {
		height: "20%",
		width: "100%",
		flexDirection: "row",
	},
});

export default CameraScreen;
