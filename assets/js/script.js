
let totalArray = []

let calcCaloriesBtn = document.getElementById('calculate-calories');
let saveRecipesBtn = document.getElementById('save-recipes');
let showRecipeBtn = document.getElementById('show-recipe');
let mealDropdown = document.getElementById('dropdown');
let recipeTitleEl = document.querySelector(".card-title");
let ingredientList = document.querySelector(".collection");
let ingredientsEl = document.querySelectorAll(".collection-item");
var requestUrl2 = `https://api.edamam.com/api/nutrition-data?app_id=bf8b57b9&app_key=ed2c6d2b951714d94592330e1ad66fd2&nutrition-type=cooking&ingr=egg`;
let recipeHistory = JSON.parse(localStorage.getItem("recipes")) || [];

let tableBody = document.getElementById("tableBody");

showRecipeBtn.addEventListener("click", function () {

})

saveRecipesBtn.addEventListener("click", function () {
    localStorage.setItem("recipes", JSON.stringify(recipeHistory));
})

let results = new Array;
var results1 = new Array;

fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=a`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        results = (data.meals);
        console.log(results);       
    });

fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=b`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        results1 = (data.meals);

        let totalResults = results.concat(results1);

        console.log(totalResults);
        console.log(results);
        console.log(totalResults)

        showMeals(totalResults);
    });


function showMeals(results) {
    
let configuredData = [];

mealDropdown.innerHTML = "";
    for (let i = 0; i < results.length; i++) {

        mealDropdown.innerHTML += `<a>${results[i].strMeal}</a>`;
        
         let obj = {meal:results[i].strMeal}
        for(let y = 0; y < 20; y++){
            if(results[i][`strMeasure${y}`] && results[i][`strIngredient${y}`]){
            let obj = {measure: results[i][`strMeasure${y}`], ingredient: results[i][`strIngredient${y}`]}
            configuredData.push(obj)
            }
        }
        obj["data"] = configuredData;
        configuredData = [];
        totalArray.push(obj);
    }
    console.log(totalArray);
}


calcCaloriesBtn.addEventListener("click", function(e) {

    let measure = e.target.getAttribute("measure1");
    measure = measure.replace(" ","%20");

    let ingredient1 = e.target.getAttribute("ingredient1");
    ingredient1 = ingredient1.replace(" ","%20");

    let ingredient = measure+"%2C"+ingredient1;
    console.log(ingredient);

    var requestUrl2 = `https://api.edamam.com/api/nutrition-data?app_id=e9200f1f&app_key=%2044c8f29589b07d2306fc29112f74e5d2&nutrition-type=cooking&ingr=${ingredient}`;
    fetch(requestUrl2)
    .then(resp => resp.json())
    .then(data => showTable(data))
})

function showTable(data) {
console.log(data);

tableBody.innerHTML="";
tableBody.innerHTML+=`
<tr>
<td>${data.totalWeight}</td>
<td>${data.totalNutrients.CHOCDF.unit}</td>
<td>${data.ingredients[0].text}</td>
<td>${data.calories}</td>
</tr>
`
}

mealDropdown.addEventListener("click", function(event) {
console.log(event.target.innerHTML);

var currentMeal = event.target.innerText;
var currentMealDetails = "";

    recipeTitleEl.textContent = "";
    let recipeName = document.createElement('h5'); 
    recipeName.textContent = currentMeal;
    recipeTitleEl.append(recipeName);

for (let i = 0; i < totalArray.length; i++){

    if (currentMeal.trim() === totalArray[i].meal.trim()) {
    
    currentMealDetails = totalArray[i];
}
}
     console.log(currentMealDetails);
})