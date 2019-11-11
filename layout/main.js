function addInputField(id){
	let inputs = document.getElementById(id);
	let input = document.createElement("INPUT");
	input.setAttribute("type", "text");
	input.setAttribute("name", "directions");
	inputs.appendChild(input);
}

function getAllRecipes(){
	$.ajax({
		method: 'GET',
		url: "/getRecipes",
		dataType: "json",
		success: function(recipes){
			let display = document.getElementById("main-box");
			for(let x=0; x<recipes.length; x++){
				let div = document.createElement("DIV");
				div.innerHTML = `Recipe: ${recipes[x].title} <a href="/recipe/${recipes[x]._id}">See Recipe<a>`;
				display.appendChild(div);
			}
			console.log(recipes);
		}
	});
}