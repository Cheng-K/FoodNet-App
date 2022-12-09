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
					time_created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
				SELECT file_uri,category,ingredients,calorie,carbs,protein,fat, date(time_created,'localtime') AS date, time(time_created,'localtime') AS time 
				FROM Records
				ORDER BY time_created DESC
				LIMIT ?`,
				[k],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectRecordsOnDate(date) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT file_uri,category,ingredients,calorie,carbs,protein,fat, date(time_created,'localtime') AS date, time(time_created,'localtime') AS time 
				FROM Records
				WHERE strftime('%s',date(time_created,'localtime')) = strftime('%s',?)
				ORDER BY time_created ASC`,
				[date],
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
				SELECT date(time_created,'localtime') AS date
				FROM Records
				ORDER BY time_created ASC
				LIMIT 1`,
				[],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectNutrientsSumBetweenDates(startDate, endDate) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT sum(calorie) AS sum_calorie, sum(carbs) AS sum_carbs, sum(protein) AS sum_protein, 
				sum(fat) AS sum_fat, date(time_created,'localtime') AS date
				FROM Records 
				WHERE strftime('%s',date(time_created,'localtime')) 
				BETWEEN strftime('%s',?) AND strftime('%s',?)
				GROUP BY date(time_created,'localtime')
				ORDER BY date(time_created,'localtime') ASC
				`,
				[startDate, endDate],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}

export async function selectNutrientsSumOnDate(date) {
	const promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`
				SELECT sum(calorie) AS sum_calorie, sum(carbs) AS sum_carbs, sum(protein) AS sum_protein, sum(fat) AS sum_fat
				FROM Records 
				WHERE strftime('%s',date(time_created,'localtime')) = strftime('%s',?)
				`,
				[date],
				(txObj, resultSet) => resolve(resultSet),
				(txObj, errorObj) => reject(errorObj)
			);
		});
	});
	return promise;
}
