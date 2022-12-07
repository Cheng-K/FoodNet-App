export function processData(rows) {
	const calorie = [];
	const carbs = [];
	const protein = [];
	const fat = [];

	rows.forEach((item) => {
		calorie.push({ value: item.calorie });
		carbs.push({ value: item.carbs });
		protein.push({ value: item.protein });
		fat.push({ value: item.fat });
	});

	return [calorie, carbs, protein, fat];
}
