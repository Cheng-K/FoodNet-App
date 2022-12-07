import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("foodnet.db");

export async function createDatabaseTables() {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) =>
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS Records (
					file_uri TEXT NOT NULL PRIMARY KEY, 
					category TEXT NOT NULL, 
					ingredients TEXT NOT NULL, 
					calorie REAL NOT NULL, 
					carbs REAL NOT NULL, 
					protein REAL NOT NULL, 
					fat REAL NOT NULL, 
					date_created TEXT NOT NULL DEFAULT CURRENT_DATE , 
					time_created TEXT NOT NULL DEFAULT CURRENT_TIME
				)`,
				null,
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			)
		);
	});
	return promise;
}

export async function dropTable() {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`DROP TABLE Records`,
				[],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, error) => reject(error)
			);
		});
	});
	return promise;
}

export async function insertRecords(record) {
	console.log(record);
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`INSERT INTO Records
				(file_uri,category,ingredients,calorie,carbs,protein,fat)
				VALUES (?,?,?,?,?,?,?)`,
				[
					record.file_uri,
					record.category,
					record.ingredients,
					record.calorie,
					record.carbs,
					record.protein,
					record.fat,
				],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectLastKRecords(k) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT file_uri,category,ingredients,calorie,carbs,protein,fat, date(date_created,'localtime') AS date, time(time_created,'localtime') AS time FROM Records
				ORDER BY date_created DESC, time_created DESC
				LIMIT ?`,
				[k],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectEarliestDate() {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT date(date_created,'localtime') AS date
				FROM Records
				ORDER BY date_created ASC
				LIMIT 1`,
				[],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectNutrientsOnDate(date) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT calorie,carbs,protein,fat, strftime('%s',time_created) AS time
				FROM Records 
				WHERE strftime('%s',date_created) = strftime('%s',?)
				ORDER BY time_created ASC
				`,
				[date],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectNutrientsFromToday(offset) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT calorie, carbs, protein, fat,
				FROM Records 
				WHERE unixepoch(date_created) = unixepoch('now','? day')
				ORDER BY time_created ASC
				`,
				[offset],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectNutrientsSumFromToday(offset) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT sum(calorie) AS sum_calorie, sum(carbs) AS sum_carbs, sum(protein) AS sum_protein, sum(fat) AS sum_fat
				FROM Records 
				WHERE strftime('%s',date_created,'localtime') = strftime('%s',date('now',?),'localtime')
				`,
				[`${offset} days`],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}
