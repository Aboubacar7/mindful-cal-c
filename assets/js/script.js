let calorieInputEl = document.querySelector('#calorie-goal');
let calcCaloriesBtn = document.getElementById('calculate-calories');
let saveRecipesBtn = document.getElementById('save-recipes');
let showRecipeBtn = document.getElementById('show-recipe');
let portionSizeBtn = document.getElementById('portion-size');
let recipeHistory = JSON.parse(localStorage.getItem("recipes")) || [];


let calorieGoal = calorieInputEl.value.trim();

calcCaloriesBtn.addEventListener("click", function () {
    
})

showRecipeBtn.addEventListener("click", function () {

})

portionSizeBtn.addEventListener("click", function () {

})

saveRecipesBtn.addEventListener("click", function () {
    localStorage.setItem("recipes", JSON.stringify(recipeHistory));
})