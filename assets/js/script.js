
let totalArray = []

let calcCaloriesBtn = document.getElementById('calculate-calories');
let saveRecipesBtn = document.getElementById('save-recipes');
let showRecipeBtn = document.getElementById('show-recipe');
let mealDropdown = document.getElementById('dropdown');
let recipeName = document.querySelector(".card-title");
let ingredientList = document.querySelector(".collection");
var requestUrl2 = `https://api.edamam.com/api/nutrition-data?app_id=bf8b57b9&app_key=ed2c6d2b951714d94592330e1ad66fd2&nutrition-type=cooking&ingr=egg`;
let recipeHistory = JSON.parse(localStorage.getItem("recipes")) || [];

let tableBody = document.getElementById("tableBody");

showRecipeBtn.addEventListener("click", function () {

})

saveRecipesBtn.addEventListener("click", function () {
    localStorage.setItem("recipes", JSON.stringify(recipeHistory));
})

var apiKey = 'PmYKMh41zdKaVKHl5skTd8vvNpf065hiw6dkL8RV';
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
        console.log(results);
        console.log(totalResults)
        showMeals(totalResults);
    });


function showMeals(results) {

    //demo
    
let configuredData = []
//
    collections.innerHTML = ""
    for (let i = 0; i < results.length; i++) {

        collections.innerHTML += `<a class="collection-item" measure1="${results[i].strMeasure1}" ingredient1="${results[i].strIngredient1}" >${results[i].strMeal}</a>`
        //demo
         let obj = {meal:results[i].strMeal}
        for(let y = 0; y < 20; y++){
            if(results[i][`strIngredient${y}`] && results[i][`strMeasure${y}`]){
            let obj = {ingredient: results[i][`strIngredient${y}`], measure: results[i][`strMeasure${y}`]}
            configuredData.push(obj)
            }

        }
        obj["data"] = configuredData
        configuredData = []
        totalArray.push(obj)
        //





    mealDropdown.innerHTML = "";
    for (let i = 0; i < results.length; i++) {

        mealDropdown.innerHTML += `<a class="collection-item" measure1="${results[i].strMeasure1}" ingredient1="${results[i].strIngredient1}">${results[i].strMeal}</a>`

    }
    console.log(totalArray)
}



collections.addEventListener("click", function(e) {

mealDropdown.addEventListener("click", function(e) {

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

function showTable(data){
console.log(data);

tableBody.innerHTML=""
tableBody.innerHTML+=`
<tr>
<td>${data.totalNutrients.CHOCDF.quantity}</td>
<td>${data.totalNutrients.CHOCDF.unit}</td>
<td>${data.calories}</td>
</tr>
`
}

collections.addEventListener("click", function(event){
console.log(event.target.innerHTML)
var currentMeal = event.target.innerText
var currentMealDetails = ""
for ( let i = 0; i < totalArray.length; i++){


if (currentMeal.trim() === totalArray[i].meal.trim()){
    
    currentMealDetails = totalArray[i]
}
}
     console.log(currentMealDetails)
})