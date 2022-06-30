import icons from '../../img/icons.svg';
import View from './views.js';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `could'nt find any recipies based on search.search again`;
  _message = '';

  //generate view to view the results of recipies on left
  //we've called render method on results.view in controller.js..we can see the render merhod in views.js
  //now render method assigns data value of class..//we have an arr of recipies in data which came from model..we assigned them in controller and called here in view
  //now we loop over every index in data and generate html for it
  _generateMarkup() {
    //for every recipe in recipies array..we add the html and join it
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
    return `
    <li class="preview">
            <a class="preview__link " href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
              </div>
            </a>
          </li>
    `;
  }
}

export default new resultsView();
