import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";

function ImagePickerModal({ navigation }) {
	return (
		<Screen style={styles.scan_modal_container}>
			<View style={styles.scan_modal}>
				<View style={styles.scan_modal_btn}>
					<Button
						color={colors.secondary_cinnamon}
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
											onPress: () =>
												Linking.openSettings(),
										},
										{
											text: "CANCEL",
										},
									]
								);
							} else {
								const image =
									await ImagePicker.launchCameraAsync({
										allowsEditing: true,
										aspect: [1, 1],
									});
								console.log(image);
							}
						}}
					/>
				</View>
				<View style={styles.scan_modal_btn}>
					<Button
						color={colors.secondary_cinnamon}
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
											onPress: () =>
												Linking.openSettings(),
										},
										{
											text: "CANCEL",
										},
									]
								);
							} else {
								const image =
									await ImagePicker.launchImageLibraryAsync({
										allowsEditing: true,
										aspect: [1, 1],
									});
								console.log(image);
							}
						}}
					/>
				</View>
				<View style={styles.scan_modal_btn}>
					<Button
						color={colors.accent_red}
						title="Close"
						onPress={() => navigation.goBack()}
					/>
				</View>
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
	scan_modal_btn: {
		marginTop: 20,
	},
	scan_modal_container: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.6)",
	},
});

export default ImagePickerModal;
