// Select elements
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn= document.querySelector('.recipe-close-btn');

// Function to fetch recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>"; // Show loading message

    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        // Clear the container after fetching
        recipeContainer.innerHTML = "";

        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found</h2>";
            return;
        }

        // Loop through each meal and display it
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>Area: ${meal.strArea}</span> Dish</p>
                <p><span>Category: ${meal.strCategory}</span></p>
            `;
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            /*Adding EventListener to recipe*/
            button.addEventListener('click', () =>{
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        recipeContainer.innerHTML = "<h2>Failed to fetch recipes. Try again!</h2>";
        console.error("Error fetching recipes:", error);
    }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = " ";
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>
                ${ingredient} - ${measure}
            </li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}
const openRecipePopup = (meal) =>{
    recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    `;
    

    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click', ()=>{
    recipeDetailsContent.parentElement.style.display =" none";
})


// Event listener for search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim(); // Get user input
    if (searchInput) {
        fetchRecipes(searchInput); // Fetch recipes if input is not empty
    } else {
        recipeContainer.innerHTML = "<h2>Please enter a meal</h2>";
    }
});

