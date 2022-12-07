export function formatString(dateString) {
	return new Date(dateString);
}

export function dateToString(date, option = 1) {
	if (option === 1) {
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		date = date.getDate();
		month =
			month.toString().length === 2
				? month.toString()
				: month.toString().padStart(2, "0");
		date =
			date.toString().length === 2
				? date.toString()
				: date.toString().padStart(2, "0");
		return `${year}-${month}-${date}`;
	} else {
		const dayOfWeek = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const monthName = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		let year = date.getFullYear();
		let month = monthName[date.getMonth()];
		let day = dayOfWeek[date.getDay()];
		let currentDate = date.getDate();
		return `${day}, ${currentDate} ${month} ${year}`;
	}
}

export function generateDatesBetween(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(
		startDate.getFullYear(),
		startDate.getMonth(),
		startDate.getDate()
	);
	while (currentDate <= endDate) {
		dates.push(currentDate);
		currentDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() + 1
		);
	}
	return dates;
}
