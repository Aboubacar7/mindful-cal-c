// DOM elements
let totalArray = []
let calcCaloriesBtn = document.getElementById('calculate-calories');
let saveRecipesBtn = document.getElementById('save-recipes');
let showRecipeBtn = document.getElementById('show-recipe');
let mealDropdown = document.getElementById('dropdown');
let recipeTitleEl = document.querySelector(".card-title");
let calorieTable = document.querySelector(".ingredients-table");
let ingredientsEl = document.querySelectorAll(".collection-item");
let recipeHistory = JSON.parse(localStorage.getItem("recipes")) || [];
let tableBody = document.getElementById("tableBody");
let savedReceiptsEl = document.getElementById("savedReceipts");

let results = new Array;
let results1 = new Array;

// two fetch API requests compile the meal data into 2 previously empty arrays
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

        showMeals(totalResults);
    });

// for loop that first shows the meal names from the recipe data and displays it in the dropdown menu. Next another for loop compiles all the measures, ingredients and recipes into an object then pushes them into an array.
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
    }
    console.log(totalArray);
}

// when the recipe title is clicked in the dropdown menu, the measure and ingredients data runs through a for loop so they are displayed in the table element
mealDropdown.addEventListener("click", function (event) {
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

    document.querySelector("table").innerHTML = "";
    for (let i = 0; i < currentMealDetails.data.length; i++) {
        
        document.querySelector("table").innerHTML += `
    <tr>
        <td>${currentMealDetails.data[i].measure}</td>
        <td>${currentMealDetails.data[i].ingredient}</td>
    </tr>
    `
    }

    calcCaloriesBtn.classList.remove("hide");
    showRecipeBtn.classList.remove("hide");
    
    console.log(currentMealDetails)
})

// Loops through the selected recipe's measurements and ingredients and passes it thought the second API to display on the webpage table
calcCaloriesBtn.addEventListener("click", function () {
    calorieTable.classList.remove("hide");
    
    const ingredientURLs = [];

    for (let i = 0; i < currentMealDetails.data.length; i++) {

        const encodedMeasure = encodeURIComponent(currentMealDetails.data[i].measure);

        const encodedIngredient = encodeURIComponent(currentMealDetails.data[i].ingredient);

        ingredientURLs.push(fetch(`https://api.edamam.com/api/nutrition-data?app_id=e9200f1f&app_key=%2044c8f29589b07d2306fc29112f74e5d2&nutrition-type=cooking&ingr=${encodedMeasure}%20${encodedIngredient}`).then(response => response.json()));
    }
    Promise.all(ingredientURLs)
        .then(data => showTable(data))
})
// Pulls the data from the first url and compiles into table elements. Called in the Calculate Calories button
function showTable(data) {
    console.log(data);
    
    tableBody.innerHTML = "";
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

// displays the selected recipes instructions 
showRecipeBtn.addEventListener("click", function () {
    console.log(currentMealDetails.data[0].recipe);
    
    document.querySelector('#recipe-instructions').innerHTML = "";
    document.querySelector('#recipe-instructions').innerHTML = `<p>${currentMealDetails.data[0].recipe}</p>`;

    saveRecipesBtn.classList.remove("hide");
    document.querySelector('#meal-id').classList.remove("hide");
})

// saves the selected recipe in local storage and calls on the next function that displays the saved recipes
saveRecipesBtn.addEventListener("click", function () {
    if (!recipeHistory.includes(currentMealDetails.meal)){

    recipeHistory.push(currentMealDetails);
    localStorage.setItem("recipes", JSON.stringify(recipeHistory));
    showSavedRecipes();
    }});

function showSavedRecipes(){
    savedReceiptsEl.innerHTML="<ul>"

    for (let i = 0; i < recipeHistory.length;i++) {
         savedReceiptsEl.innerHTML += `<li><a href="#" data-attr="${recipeHistory[i].data[0].recipe}">${recipeHistory[i].meal}</a></li>`
    };
    
    savedReceiptsEl.innerHTML+="</ul>"
}

savedReceiptsEl.addEventListener("click", function(e) {
    document.querySelector('#recipe-instructions').innerHTML = "";
    document.querySelector('#recipe-instructions').innerHTML = e.target.getAttribute("data-attr");
})