import React, { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import AppButton from "../components/AppButton";
import colors from "../config/colors";
import Screen from "../components/Screen";
import useMountedModel from "../hooks/useMountedModel";

function ImagePickerModal({ navigation }) {
	const { mountedModel, setModelIsRunning } = useMountedModel();
	useEffect(() => {
		if (!mountedModel) {
			Alert.alert(
				"Model not found.",
				"The required component for analyzing food images is not found. Please restart the application with stable internet connection.",
				[
					{
						text: "Back to Home",
						onPress: () => navigation.navigate("HomeStack"),
					},
				]
			);
		}
	});
	return (
		<Screen style={styles.scan_modal_container}>
			<View style={styles.scan_modal}>
				<AppButton
					backgroundColor={colors.secondary_cinnamon}
					color={colors.primary_white}
					IconComponent={
						<MaterialIcons
							name="camera"
							size={24}
							color={colors.primary_white}
						/>
					}
					title="Scan with camera"
					onPress={async () => {
						const cameraPermission =
							await ImagePicker.requestCameraPermissionsAsync();
						const mediaPermission =
							await ImagePicker.requestMediaLibraryPermissionsAsync();
						if (
							!cameraPermission.granted ||
							!mediaPermission.granted
						) {
							Alert.alert(
								"Permissions Denied",
								"FoodNet requires camera and media library permissions for its scan camera to work. Please enable it in settings.",
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
								const image =
									await ImagePicker.launchCameraAsync({
										allowsEditing: true,
										aspect: [1, 1],
										base64: true,
									});
								if (!image.cancelled) {
									setModelIsRunning(true);
									navigation.navigate("Results", {
										imageUri: image.uri,
										imageBase64: image.base64,
									});
								}
							} catch (e) {
								console.error(e);
							}
						}
					}}
				/>
				<AppButton
					backgroundColor={colors.secondary_cinnamon}
					color={colors.primary_white}
					IconComponent={
						<MaterialIcons
							name="photo-library"
							size={24}
							color={colors.primary_white}
						/>
					}
					title="Choose from gallery"
					onPress={async () => {
						const mediaPermission =
							await ImagePicker.requestMediaLibraryPermissionsAsync();
						if (!mediaPermission.granted) {
							Alert.alert(
								"Permissions Denied",
								"FoodNet requires media library permissions to choose photos from gallery. Please enable it in settings.",
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
								const image =
									await ImagePicker.launchImageLibraryAsync({
										allowsEditing: true,
										aspect: [1, 1],
										base64: true,
									});
								if (!image.cancelled) {
									setModelIsRunning(true);
									navigation.navigate("Results", {
										imageUri: image.uri,
										imageBase64: image.base64,
									});
								}
							} catch (e) {
								console.error(e);
							}
						}
					}}
				/>
				<AppButton
					backgroundColor={colors.accent_red}
					color={colors.primary_white}
					title="Close"
					IconComponent={
						<MaterialIcons
							name="close"
							size={24}
							color={colors.primary_white}
						/>
					}
					onPress={() => navigation.goBack()}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	scan_modal: {
		width: "100%",
		height: "30%",
		backgroundColor: colors.primary_white,
		borderTopStartRadius: 15,
		borderTopEndRadius: 15,
		justifyContent: "space-around",
		padding: 15,
	},
	scan_modal_container: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: colors.opaque_black,
	},
});

export default ImagePickerModal;
