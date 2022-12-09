import colors from "../config/colors";
import { stringToDate } from "./datetime";

export function parseWeeklyNutrientsSum(rows) {
	const calorie = [];
	const carbs = [];
	const protein = [];
	const fat = [];
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let currentDay = 0;
	let currentIndex = 0;

	while (currentDay <= 6) {
		let dayRetrieved;
		if (currentIndex >= rows.length) dayRetrieved = null;
		else dayRetrieved = stringToDate(rows[currentIndex].date).getDay();
		if (!dayRetrieved || dayRetrieved !== currentDay) {
			calorie.push(
				createBarData({ label: days[currentDay], value: 200 })
			);
			carbs.push(createBarData({ label: days[currentDay], value: 50 }));
			protein.push(
				createBarData({ label: days[currentDay], value: 790 })
			);
			fat.push(createBarData({ label: days[currentDay], value: 90 }));
		} else {
			calorie.push(
				createBarData({
					label: days[currentDay],
					value: rows[currentIndex].sum_calorie,
				})
			);
			carbs.push(
				createBarData({
					label: days[currentDay],
					value: rows[currentIndex].sum_carbs,
				})
			);
			protein.push(
				createBarData({
					label: days[currentDay],
					value: rows[currentIndex].sum_protein,
				})
			);
			fat.push(
				createBarData({
					label: days[currentDay],
					value: rows[currentIndex].sum_fat,
				})
			);
			currentIndex += 1;
		}
		currentDay += 1;
	}

	return { calorie, carbs, protein, fat };
}

function createBarData(data) {
	return {
		...data,
		frontColor: colors.secondary_cinnamon,
		barBorderRadius: 15,
		barMarginBottom: 3,
		barWidth: 17,
		spacing: 26.5,
	};
}
