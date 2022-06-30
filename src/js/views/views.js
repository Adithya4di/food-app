import icons from '../../img/icons.svg';
//recipe and result view has common features like spinner..error msgs..handlers etc..so we create a parent class view to both of them so they both can inherit it..we directly export class here as we dont create any instance of this class and we import whole class functionality to other views
export default class view {
  _data;
  //render recieves data for all views and initializes it..so we wont write any other func body in here..we keep it clean as it is a parent method
  render(data) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    //we've selected the ele above..it has the recipe obj in _data passed in controller through render method
    //now we'll add the above html to it
    //but before we remove html if there was any
    //console.log(this._data.cookingTime, this._data.publisher);
    //every view has their own generate markup() based on the html they display..we call it here
    const recipeMarkup = this._generateMarkup();
    //to clear recipe container previous text..we call clear method to clean and then addd our text
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', recipeMarkup);
  }

  // update(data) {
  //   if (!data || (Array.isArray(data) && data.length == 0))
  //     return this.renderError();

  //   this._data = data;
  //   //we've selected the ele above..it has the recipe obj in _data passed in controller through render method
  //   //now we'll add the above html to it
  //   //but before we remove html if there was any
  //   //console.log(this._data.cookingTime, this._data.publisher);
  //   //every view has their own generate markup() based on the html they display..we call it here
  //   const recipeMarkup = this._generateMarkup();
  // }

  //add spinner until page loads
  //css spinner has rotation animation set to infinite..so it will rotate forvver
  //animation :rotate 2s infinite linear..for rotate we have a method using key frames
  //@keyframes rotate..which has transform properties to rotate by 360 deg
  renderSpinner() {
    const spinnerMarker = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarker);
  }

  //rendering error in view(ui) instead of console(model)
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    //clears previous data from parent before adding our data
    this._parentElement.innerHTML = '';
  }
}
