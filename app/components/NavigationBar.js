import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import colors from "../config/colors";
import NavigationButton from "./NavigationButton";

function NavigationBar({
	style,
	isHomeSelected,
	isStatsSelected,
	onHomeSelect,
	onStatsSelect,
	onCameraSelect,
}) {
	return (
		<View style={[styles.root, style]}>
			<NavigationButton
				icon={
					<MaterialIcons
						name="home"
						size={30}
						color={
							isHomeSelected
								? colors.secondary_cinnamon
								: colors.secondary_grey
						}
						style={styles.icon}
					/>
				}
				name="Home"
				highlighted={isHomeSelected}
				onSelect={onHomeSelect}
			/>
			<NavigationButton
				icon={
					<MaterialIcons
						name="camera-alt"
						size={28}
						color={colors.primary_white}
						style={styles.icon}
					/>
				}
				name="Scan"
				main={true}
				onSelect={onCameraSelect}
			/>
			<NavigationButton
				icon={
					<MaterialIcons
						name="bar-chart"
						size={30}
						color={
							isStatsSelected
								? colors.secondary_cinnamon
								: colors.secondary_grey
						}
						style={styles.icon}
					/>
				}
				name="Statistics"
				highlighted={isStatsSelected}
				onSelect={onStatsSelect}
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
