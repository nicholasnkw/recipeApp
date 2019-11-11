const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
//git ignored
const mongodInfo = require('./dbpassword.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongodInfo.mdURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("DB connected");
});

app.use(express.static('layout'));
//Pug to set variables displayed in front end
app.set('views', './layout');
app.set('view engine', 'pug');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

var recipeSchema = new mongoose.Schema({
  title: String,
  category: String, 
  prepTime: Number,
  cookingTime: Number, 
  ingredients: [String],
  directions: [String]
});

var Recipe = mongoose.model('Recipe', recipeSchema);



app.get('/', (req, res) => {
	// res.sendFile(__dirname + "/layout/main.html")
	//static file serving
	res.redirect("/main.html");
});


app.post('/create-recipe', (req, res) => {
	let newRecipe = new Recipe();
	newRecipe.title = req.body["title"];
	newRecipe.category = req.body["category"];
	newRecipe.prepTime = req.body["prep-time"];
	newRecipe.cookingTime = req.body["cooking-time"];
	let ing = req.body["ingredients"];
	for(let i=0; i<ing.length; i++){
		if(ing[i] != ""){
			newRecipe.ingredients.push(ing[i]);
		}
	}

	let dir = req.body["directions"];
	for(let i=0; i<dir.length; i++){
		if(dir[i] != ""){
			newRecipe.directions.push(dir[i]);
		}
	}


	newRecipe.save(function (error, recipeObj){
		if(error) return console.error(error);
		res.redirect('/recipe/' + recipeObj.id);
	});

});

app.get('/recipe/:uid', (req, res) => {
	//using Pug to display
	let dbRecipe = Recipe.findById(req.params.uid, function(err, reciObj) {
		if(err) {
			console.error(err);
			res.sendFile(__dirname + "/layout/error.html");
			return;
		}
		let reciResult = {
			reciTitle: reciObj.title,
			reciCategory: reciObj.category,
			reciPTime: reciObj.prepTime,
			reciCTime: reciObj.cookingTime,
			reciTTime: reciObj.prepTime + reciObj.cookingTime,
			reciIngredients: reciObj.ingredients,
			reciDirections: reciObj.directions
		};

		res.render('recipe', reciResult);

	});

});


app.get('/getRecipes', (req, res) => {
	let reciQuery = Recipe.find().select('id title');
	reciQuery.exec(function(err, objs){
		if(err){
			console.error(err);
			res.sendFile(__dirname + "/layout/error.html");
			return;
		}
		res.send(objs);
		return;
	});
});


