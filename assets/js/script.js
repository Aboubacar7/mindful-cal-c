let totalArray = []
let cardTitle = document.querySelector("#card-title");
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
    let recipeCard = document.querySelector(".recipe-card");
    recipeCard.removeAttribute("hide");

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
 showSavedRecipes()
    let configuredData = [];

    mealDropdown.innerHTML = "";
    for (let i = 0; i < results.length; i++) {

        mealDropdown.innerHTML += `<a>${results[i].strMeal}</a>`;

        let obj = { meal: results[i].strMeal }
        for (let y = 0; y < 20; y++) {
            if (results[i][`strMeasure${y}`] && results[i][`strIngredient${y}`] && results[i][`strInstructions`]) {
                let obj = { measure: results[i][`strMeasure${y}`], ingredient: results[i][`strIngredient${y}`], recipe: results[i][`strInstructions`] }
                configuredData.push(obj)
            }
        }
        obj["data"] = configuredData;
        configuredData = [];
        totalArray.push(obj);
        x(results[i].strInstructions)
       
    }
    console.log(totalArray);
}


calcCaloriesBtn.addEventListener("click", function() {

    let measure = currentMealDetails.data[i].measure;
    measure = measure.replace(" ","%20");

    let ingredient1 = currentMealDetails.data[i].ingredient;
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

    currentMeal = event.target.innerText;
    currentMealDetails = "";

    recipeTitleEl.textContent = "";
    let recipeName = document.createElement('h5');
    recipeName.textContent = currentMeal;
    recipeTitleEl.append(recipeName);

    for (let i = 0; i < totalArray.length; i++) {

    if (currentMeal.trim() === totalArray[i].meal.trim()) {
    
    currentMealDetails = totalArray[i];
}
}

for (let i = 0; i<currentMealDetails.data.length; i++) {
    document.querySelector("table").innerHTML +=`
    <tr>
        <td>${currentMealDetails.data[i].measure}</td>
        <td>${currentMealDetails.data[i].ingredient}</td>
    </tr>
    `
    }

    console.log(currentMealDetails)
})

calcCaloriesBtn.addEventListener("click", function () {

    const ingredientURLs = [];

    for (let i = 0; i < currentMealDetails.data.length; i++) {

        const encodedMeasure = encodeURIComponent(currentMealDetails.data[i].measure);

        const encodedIngredient = encodeURIComponent(currentMealDetails.data[i].ingredient);

        ingredientURLs.push(fetch(`https://api.edamam.com/api/nutrition-data?app_id=e9200f1f&app_key=%2044c8f29589b07d2306fc29112f74e5d2&nutrition-type=cooking&ingr=${encodedMeasure}%20${encodedIngredient}`).then(response => response.json()));
    }
    Promise.all(ingredientURLs)
        .then(data => showTable(data))
})

function showTable(data) {
    console.log(data);

    for (i = 0; i < data.length; i++) {
        tableBody.innerHTML += `
    <tr>
    <td>${data[i].totalWeight}</td>
    <td>${data[i].totalNutrients?.CHOCDF?.unit}</td>
    <td>${data[i].ingredients?.length > 0 ? data[i].ingredients[0].text.slice(data[i].ingredients[0].text.indexOf(" ")) : "no listed ingredients"}</td>
    <td>${data[i].calories}</td>
    </tr>
    `
    }
}

showRecipeBtn.addEventListener("click", function () {
    console.log(currentMealDetails.data[0].recipe);
    
    document.querySelector('#recipe-instructions').innerHTML = "";
    document.querySelector('#recipe-instructions').innerHTML = `<p>${currentMealDetails.data[0].recipe}</p>`;
})
saveRecipesBtn.addEventListener("click", function () {
    if (!recipeHistory.includes(currentMealDetails.meal)){

    
    recipeHistory.push(currentMealDetails);
    localStorage.setItem("recipes", JSON.stringify(recipeHistory));
    showSavedRecipes();
    }});
function showSavedRecipes(){
    savedReceiptsEl.innerHTML="<ul>"
    for (let i=0;i<recipeHistory.length;i++){
         savedReceiptsEl.innerHTML += `<li><a href="#" data-attr="${recipeHistory[i].data[0].recipe}"> ${recipeHistory[i].meal}</a></li>`
    };
    savedReceiptsEl.innerHTML+="</ul>"
}

savedReceiptsEl.addEventListener("click", function(e){
    document.querySelector('#recipe-instructions').innerHTML = "";
    document.querySelector('#recipe-instructions').innerHTML = e.target.getAttribute("data-attr");
})