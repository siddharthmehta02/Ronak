/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const mysql = require("mysql");
const app = express();
const port = 3000;

const db = mysql.createConnection({
	host: "localhost",
	user: "your_username",
	password: "your_password",
	database: "your_database",
});

db.connect((err) => {
	if (err) throw err;
	console.log("Connected to the database");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/search", async (req, res) => {
	const searchQuery = req.body.searchQuery;
	try {
		const response = await axios.get(
			`https://www.omdbapi.com/?s=${searchQuery}&apikey=5ebff3a7`
		);
		const results = response.data.Search;
		res.render("index", { results });
	} catch (error) {
		console.error(error);
		res.render("index", { results: [] });
	}
});

app.post("/favorite", (req, res) => {
	const { title, year, type, poster } = req.body;
	const favorite = { title, year, type, poster };

	db.query("INSERT INTO favorites SET ?", favorite, (err, result) => {
		if (err) throw err;
		console.log("Favorite added to the database");
		res.redirect("/");
	});
});

app.get("/favorites", (req, res) => {
	db.query("SELECT * FROM favorites", (err, results) => {
		if (err) throw err;
		res.render("favorites", { favorites: results });
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
