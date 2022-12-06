import React from "react";
import { Image, StyleSheet, View } from "react-native";
import IconText from "./IconText";
import colors from "../config/colors";
import {
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons,
	FontAwesome5,
} from "@expo/vector-icons";

function RecentItem({ item }) {
	return (
		<View style={styles.root}>
			<Image
				source={{ uri: item.file_uri }}
				resizeMode="contain"
				onError={(error) => console.log(error)}
				style={styles.image}
			/>
			<View style={styles.details}>
				<View style={styles.nutrition_flex_container}>
					<IconText
						IconComponent={
							<MaterialIcons
								name="local-fire-department"
								size={22}
								color={colors.secondary_cinnamon}
							/>
						}
						iconContainerStyle={styles.icon_container}
						titleStyle={styles.text}
						title={`${item.calorie.toFixed(2)}kcal`}
					/>
					<IconText
						IconComponent={
							<MaterialCommunityIcons
								name="noodles"
								size={22}
								color={colors.secondary_cinnamon}
							/>
						}
						iconContainerStyle={styles.icon_container}
						titleStyle={styles.text}
						title={`${item.carbs.toFixed(2)}g carbs`}
					/>
					<IconText
						IconComponent={
							<FontAwesome5
								name="fish"
								size={22}
								color={colors.secondary_cinnamon}
							/>
						}
						iconContainerStyle={styles.icon_container}
						titleStyle={styles.text}
						title={`${item.protein.toFixed(2)}g protein`}
					/>
					<IconText
						IconComponent={
							<FontAwesome5
								name="pizza-slice"
								size={22}
								color={colors.secondary_cinnamon}
							/>
						}
						iconContainerStyle={styles.icon_container}
						titleStyle={styles.text}
						title={`${item.fat.toFixed(2)}g fat`}
					/>
				</View>
				{/*				<IconText
					title={item.ingredients}
					IconComponent={
						<FontAwesome5
							name="shopping-cart"
							size={22}
							color={colors.secondary_cinnamon}
						/>
					}
					iconContainerStyle={styles.icon_container}
					titleStyle={styles.text}
					numberOfLines={2}
				/>*/}
				<IconText
					IconComponent={
						<Ionicons
							name="time-outline"
							size={22}
							color={colors.secondary_cinnamon}
						/>
					}
					iconContainerStyle={styles.icon_container}
					titleStyle={[styles.text, styles.greyed_text]}
					title={`${item.date} ${item.time}`}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 10,
	},
	icon_container: {
		backgroundColor: "transparent",
		width: 30,
		height: 30,
		borderRadius: 0,
		marginRight: 5,
	},
	image: {
		width: 139,
		height: 124,
	},
	details: {
		flex: 1,
		marginLeft: 10,
	},
	nutrition_flex_container: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
	},
	text: {
		fontSize: 14,
	},
	greyed_text: {
		color: colors.secondary_grey,
	},
});

export default RecentItem;
