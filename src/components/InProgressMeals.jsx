import copy from 'clipboard-copy';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchApiMeals } from '../service/APIs';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import './InProgress.css';

function InProgressMeals(props) {
  const idProps = props;
  const { id } = idProps;
  const [filterMeals, setFilterMeals] = useState([]);
  const [filterObject, setFilterObject] = useState({});
  const [listChecked, setListChecked] = useState([]);
  const [clipboard, setClipboard] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [disable, setDisable] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchApi = async () => {
      const api = await fetchApiMeals(id);
      const filteredApi = api.filter((meal) => meal.idMeal === id);
      setFilterMeals([...filteredApi]);
      setFilterObject(...filteredApi);
    };
    fetchApi();
    const arrayLocalStorage = JSON
      .parse(localStorage.getItem('favoriteRecipes')) || [];

    const favoriteTrue = arrayLocalStorage.some((meals) => meals.id === id);

    if (favoriteTrue) {
      setFavorite(true);
    }
  }, [setFilterMeals, id, setFavorite]);

  const objectEntries = Object.entries(filterObject);

  const getIngredients = objectEntries
    .filter((ingredient) => ingredient[0].includes('strIngredient'))
    .filter((ingredient) => ingredient[1] !== null && ingredient[1] !== '');

  useEffect(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));

    if (inProgressRecipes && inProgressRecipes.meals && inProgressRecipes.meals[id]) {
      const listCheckedFromLocalStorage = inProgressRecipes.meals[id] || [];
      setListChecked(listCheckedFromLocalStorage);
    }
  }, [id]);

  const handleChange = ({ target }) => {
    target.parentElement.className = 'ingredients';
    const verify = listChecked.some((e) => e === target.value);
    if (!verify) {
      setListChecked([...listChecked, target.value]);
    } else {
      const filtered = listChecked.filter((e) => e !== target.value);
      setListChecked(filtered);
    }
  };

  useEffect(() => {
    const dataProgress = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || { meals: {} };
    const object = {
      ...dataProgress,
      meals: {
        ...dataProgress.meals,
        [id]: listChecked,
      } };
    localStorage.setItem('inProgressRecipes', JSON.stringify(object));
    const ingredientsFinish = objectEntries
      .filter((ingredient) => ingredient[0].includes('strIngredient'))
      .filter((ingredient) => ingredient[1] !== null && ingredient[1] !== '');
    if (ingredientsFinish.length === listChecked.length) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [listChecked, id, objectEntries]);

  const isChecked = (ingredient) => listChecked.some((item) => item === ingredient);

  const clipboardClick = () => {
    copy(`http://localhost:3000/meals/${id}`);
    setClipboard('Link copied!');
  };

  const FavoriteButton = () => {
    if (favorite) {
      const arrayLocalStorage = JSON
        .parse(localStorage.getItem('favoriteRecipes')) || [];

      const arrayFiltered = arrayLocalStorage
        .filter((meals) => meals.id !== id);

      localStorage.setItem('favoriteRecipes', JSON.stringify(arrayFiltered));
    } else {
      const arrayLocalStorage = JSON
        .parse(localStorage.getItem('favoriteRecipes')) || [];

      arrayLocalStorage.push(
        {
          id,
          type: 'meal',
          nationality: filterObject.strArea || '',
          category: filterObject.strCategory || '',
          alcoholicOrNot: filterObject.strAlcoholic || '',
          name: filterObject.strMeal,
          image: filterObject.strMealThumb,
        },
      );

      localStorage.setItem('favoriteRecipes', JSON.stringify(arrayLocalStorage));
    }

    setFavorite(!favorite);
  };

  const finishButton = () => {
    const dataHoraClique = new Date();
    const tags = filterObject.strTags.split(',');
    const arrayLocalStorage = JSON
      .parse(localStorage.getItem('doneRecipes')) || [];

    arrayLocalStorage.push(
      {
        id,
        type: 'meal',
        nationality: filterObject.strArea || '',
        category: filterObject.strCategory || '',
        alcoholicOrNot: filterObject.strAlcoholic || '',
        name: filterObject.strMeal,
        image: filterObject.strMealThumb,
        doneDate: dataHoraClique,
        tags: tags || [],
      },
    );

    localStorage.setItem('doneRecipes', JSON.stringify(arrayLocalStorage));
    history.push('/done-recipes');
  };

  return (
    <div className="detail-meal">
      {filterMeals.map((element, index) => (
        <div className="detail-meal" key={ index }>
          <h3
            className="title is-3"
            data-testid="recipe-title"
          >
            {element.strArea}
          </h3>
          <img
            className="img-detail"
            data-testid="recipe-photo"
            src={ element.strMealThumb }
            alt={ element.strArea }
          />
          <p
            data-testid="recipe-category"
          >
            {`Category: ${element.strCategory}`}
          </p>
          <div className="content">
            <button
              className="button is-rounded pink-button"
              type="button"
              data-testid="share-btn"
              onClick={ clipboardClick }
            >
              <img
                src={ shareIcon }
                alt="shareIcon"
              />
            </button>
            <button
              className="button is-rounded pink-button"
              type="button"
              data-testid="favorite-btn"
              onClick={ FavoriteButton }
              src={ favorite ? blackHeartIcon : whiteHeartIcon }
            >
              <img
                src={ favorite ? blackHeartIcon : whiteHeartIcon }
                alt={ favorite ? 'blackHeartIcon' : 'whiteHeartIcon' }
              />
            </button>
          </div>
          <p>{ clipboard }</p>
          <div className="content">
            <h6
              className="title is-6"
              data-testid="recipe-title"
            >
              Instructions:
            </h6>
            <span data-testid="instructions">
              {element.strInstructions}
            </span>
          </div>
        </div>
      ))}
      {
        getIngredients.map((ingredient, index) => (
          <label
            key={ index }
            htmlFor={ ingredient[1] }
            data-testid={ `${index}-ingredient-step` }
            className={ isChecked(`${ingredient[1]}`) ? 'ingredients' : '' }
          >
            <input
              id={ ingredient[1] }
              checked={ isChecked(ingredient[1]) }
              type="checkbox"
              onChange={ handleChange }
              value={ ingredient[1] }
            />
            {ingredient[1]}
          </label>
        ))
      }
      <div className="margin-button-div">
        <button
          type="button"
          className="button is-link is-rounded"
          data-testid="finish-recipe-btn"
          disabled={ disable }
          onClick={ finishButton }
        >
          Finalizar

        </button>
      </div>
    </div>
  );
}

export default InProgressMeals;
