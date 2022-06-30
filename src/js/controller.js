import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import SearchView from './views/searchViews.js';
import paginationView from './views/paginationView.js';

import 'core-js'; //for polyfilling js elements
import 'regenerator-runtime'; //for polyfilling async await
import searchViews from './views/searchViews.js';

//these 2 are instlaled from npm

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept;
// }
///////////////////////////////////////

//fetch url from api(above url) we use async func so it returns a promise
//we use fetch to get url..if it is success it returns a promise and awaits for response
//now if page is loaded..we wait for data to load..so we await again..it runs in background..once data is available.we fetch it in json form from the response we got from url(i.e page response)

const controlRecipe = async function () {
  //this async func calls another async func getjson..and it returns back data..that means the data is the result value of promise returned by getjson func
  try {
    //window.location is entire url...hash returns hash id from url in form #123.. we want only id ..so we slice #
    //it is application logic and not business login..so it is done by controller to get ids
    const id = window.location.hash.slice(1);
    if (!id) return;
    //add spinner to recipe container
    //this is presentation logic and not business..so it goes into view
    //renderspinner is method of recipeview class..so we call it here..we've already imported obj of class as recipe view..so we call method with recipeview obj
    recipeView.renderSpinner();

    ///
    ////
    //1.loading recipe
    //we call load recipe in model.js and wait to load it..
    //load recipe is async func..it returns a promise..so we await before going to next step
    //this is one async func(controlrecipe) calling another async func(loadrecipe)..load recipe doesnt return anything..we get access to 'state.recipe' from model.js here..beacuse that is the one manipulated in controlrecipe func here..
    //so load recipe is not a pure func as it has side effect of manipulating another var state in model.js
    await model.loadRecipe(id);

    //we've created a recipeview class in view.js..weve created an recipeview obj and then pass it to controller here..now we call the recipeview.render() class method and pass on the recipe obj as a parameter that we imported from model..now that obj is then sent to view which prints it further
    //hwere controller calls model.js to create a recipe obj.to view it..it takes data from model and passes on to view.js..which views it..here view and model have no connection..controller as a bridge in between
    //we can also create obj of view class here and create a constructor
    //obj=new recipe view(model.state.recipe) passes model obj as constructor parameter to view obj.but to remove burden to controller..we create obj in view and call class method render here
    //console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(`controller eror ${err}`);
    //the error msg comes from model.js ..beacuse that is the one that generates the error if page doesnt load or data not fetched..we want that error in view instead of model..so model throws an error here..we catch it and send that error as a parameter to renderError() in view..so controllwe again connects model and view
    recipeView.renderError();
  }
};

//get search query from user and call func in model.js
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //we use this to get the value to text typed from views
    ///1.we get search query
    //2.we load the values based on query
    //3.render results
    //4.apply pagination to results
    const query = searchViews.getQuery();
    if (!query) return;
    //to get the user search,,we do dom manipulation..but we should'nt do it here just like for load recipe..so we create a new view js and write it there
    //the func doesnt return anything..it manipulates state var in model just like load recipe func does..
    //loads search results
    await model.loadSearchResults(query);
    //render results
    //console.log(model.state.search.results);
    // //results view also extends from view..so it has that render func from view..now if we call result view.render here..we will assign the value of data to resultsview.data variable..so results view prints all recipies..we have all recipies in model.state.search.results where we wrote the application logic to create recipies array..so we pass that array to create a result.data
    //console.log(model.state.search.results);

    //pagination func
    resultsView.render(model.getSearchResultsPage());

    //apply pagination html generate markup\
    //pass on entire search obj that has results arr..pages..results per page and searched query
    //we assign data passed into this.data inside render method in views..so now pagination view's data has all the data that we have passed
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
//we use publisher subscriber pattern like below mentioned...add handler in controller and pass the handler to view and control there as we cant write view func here to control handler
//after button clicked..we have page number to goto and we get it from pagination add handler click function..we retrieve the button here and render the page
const controlPagination = function (goToPage) {
  //using above results view and pagination view render methods with new page
  //render also has clear method which 1st removes the text present and replaces with new text
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1.update recipe in servings..we manipulate data in model
  model.updateServings(newServings);
  //2.update them in view
  //we simply rewrite entire view instead of changing every quantity value manually..
  //so we just copy the recipe.render func from above
  //  recipeView.render(model.state.recipe);
  //we use update instead of render
  recipeView.render(model.state.recipe);
};
//we use publisher subscriber pattern again..
//we listen to func at view and pass it to controller func..the func in view is publisher and ccontrol search results func is subscriber
//controlSearchResults();

//we have search view..recipe view to load recipe and render it..to search recipe and render the recipies based on search..so we'll now have another view that shows us the list of recipies and call the render func from here

//we pass func to view instead of implementing view in controllwe or controller in view..pass func to view and view will call the func after taking it as param
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchViews.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
