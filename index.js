let pages = ["page-ingredient-listing", "page-cocktail-listing", "page-cocktail-detail"];
let currentPage = "page-ingredient-listing";
let chosenIngredient = "";
let chosenDrink = 0;
let ingredientList = {}

$(document).ready(function() {
  navigateTo("page-ingredient-listing")
  $("#searchField").on('input', function() {
    let query = $("#searchField").val();
    if (query == "") {
      displayContent("page-ingredient-listing")
    } else {
      let newIngredientList = [];
      for (ingred of ingredientList) {
        let matched = ingred.strIngredient1.toLowerCase().match(query)
        if (matched != null) {
          newIngredientList.push(ingred)
        }
      }
      fillIngredientList(newIngredientList);
    }
  })
  $(".back_btn").click(() => goback());

  function navigateTo(pagename) {
    currentPage = pagename;
    for (page of pages) {
      $("#" + page).css("display", "none")
    }
    $("#" + pagename).css("display", "block")
    displayContent(pagename);
  }

  function displayContent(pagename) {
    if (pagename == "page-ingredient-listing") {
      $("#searchField").val("");
      fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
        .then(response => response.json())
        .then(function(myJSON) {
          ingredientList = myJSON.drinks;
          fillIngredientList(myJSON.drinks);
        })
    } else if (pagename == "page-cocktail-listing") {
      $("#drinks-list").empty();
      $("#page-cocktail-listing h1").html("Drinks based on " + chosenIngredient);
      fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + chosenIngredient)
        .then(response => response.json())
        .then(drinkListJSON => {
          for (drink of drinkListJSON.drinks) {
            $("#drinks-list").append(
              `<div id="${drink.idDrink}" class="drinkCard">
              <img src="${drink.strDrinkThumb}" alt="Drink Image" />
              <p>${drink.strDrink}</p>
            </div>`
            )
          }
          $(".drinkCard").click((e) => {
            chosenDrinkID = e.target.parentElement.id;
            navigateTo("page-cocktail-detail")
          })
        })
    } else if (pagename == "page-cocktail-detail") {
      fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + chosenDrinkID)
        .then(response => response.json())
        .then(drinkDetailsJSON => {
          let drinkDetails = drinkDetailsJSON.drinks[0];
          $("#main-image").empty();
          $("#main-image").append(`
            <img src=${drinkDetails.strDrinkThumb} alt="drink picture">
          `)
          $("#text-details h1").html(drinkDetails.strDrink)
          $("#ingredient-block").empty();
          let ingredNum = 1;
          do {
            $("#ingredient-block").append(`
            <p>${drinkDetails["strIngredient" + ingredNum]}</p>
            <p>${drinkDetails["strMeasure" + ingredNum]}</p>
          `)
            ingredNum += 1;
          }
          while (drinkDetails["strIngredient" + ingredNum] != "")
          $("#ingredient-block").append(`
          <p>Glass</p>
          <p>${drinkDetails.strGlass}</p>
        `)

          $("#text-details h4").html(`Instructions: ${drinkDetails.strInstructions}`)
        })
    }
  }

  function fillIngredientList(ingredients) {
    $("#ingredient-list").empty();
    for (drink of ingredients) {
      $("#ingredient-list").append("<p class='ingredientCard'>" + drink.strIngredient1 + "</p>");
    }
    $(".ingredientCard").click((e) => {
      chosenIngredient = e.target.innerHTML;
      navigateTo("page-cocktail-listing")
    })
  }

  function goback() {
    if (currentPage == "page-cocktail-detail") {
      navigateTo("page-cocktail-listing");
    } else if (currentPage == "page-cocktail-listing") {
      navigateTo("page-ingredient-listing");
    }
  }

})
