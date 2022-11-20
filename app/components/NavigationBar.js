import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import NavigationButton from "./NavigationButton";
import colors from "../config/colors";

function NavigationBar({ style }) {
	return (
		<View style={[styles.root, style]}>
			<NavigationButton
				icon={
					<MaterialIcons
						name="home"
						size={28}
						color={colors.secondary_grey}
						style={styles.icon}
					/>
				}
				name="Home"
			/>
			<NavigationButton
				icon={
					<MaterialIcons
						name="camera-alt"
						size={28}
						color={colors.secondary_grey}
						style={styles.icon}
					/>
				}
				name="Scan"
			/>
			<NavigationButton
				icon={
					<MaterialIcons
						name="bar-chart"
						size={28}
						color={colors.secondary_grey}
						style={styles.icon}
					/>
				}
				name="Statistics"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		width: "100%",
		height: "10%",
		flexDirection: "row",
		justifyContent: "center",
	},
});

export default NavigationBar;
