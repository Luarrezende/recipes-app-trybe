import React, { useEffect, useState, useContext } from 'react';
import copy from 'clipboard-copy';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Recommendations from './Recommendations';
import shareIcon from '../images/shareIcon.svg';
import context from '../contexts/MyContext';
import './Footer.css';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function MealDetails({ pathname }) {
  const { id } = useParams(); // Hook usado para pegar o ID que está na URL exemplo e logo em seguida fazer o fetch usando o mesmo
  const history = useHistory();

  const [recipeArrayMeal, setRecipeArrayMeal] = useState([]);
  const [recipeObjectMeal, setRecipeObjectMeal] = useState({});
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [verifyIsFavorite, setVerifyIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]); /* Array onde irei guardar meus favoritos */
  const { dataDrinks } = useContext(context);
  const [clipboard, setClipboard] = useState('');

  const clipboardClick = () => {
    copy(`http://localhost:3000/meals/${id}`);
    setClipboard('Link copied!');
  };

  useEffect(() => {
    const fetchApi = async () => {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      setRecipeArrayMeal([...data.meals]);
      setRecipeObjectMeal(...data.meals);
    };
    fetchApi();
  }, [id]);

  useEffect(() => {
    const getIdDoneRecipe = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || {};

    if (!Object.keys(getIdDoneRecipe).includes('meals')) {
      setVerifyInProgress(false);
    } else {
      setVerifyInProgress(Object.keys(getIdDoneRecipe.meals).includes(id));
    }
  }, []);

  const objectEntries = Object.entries(recipeObjectMeal);

  const getIngredients = objectEntries
    .filter((ingredient) => ingredient[0].includes('strIngredient'))
    .filter((ingredient) => ingredient[1] !== null);

  const getMeasures = objectEntries
    .filter((measure) => measure[0].includes('strMeasure'))
    .filter((measure) => measure[1] !== ' ');

  useEffect(() => {
    const getFavoritesFromLocalStorage = JSON
      .parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavorites(getFavoritesFromLocalStorage);

    const checkedIsFavorite = getFavoritesFromLocalStorage
      .some((recipe) => recipe.id === id);
    setVerifyIsFavorite(checkedIsFavorite);
  }, [id]);

  const handleClick = () => {
    if (verifyIsFavorite) {
      const updateFavorites = favorites.filter((recipe) => recipe.id !== id);
      setFavorites(updateFavorites);
      localStorage.setItem('favoriteRecipes', JSON.stringify(updateFavorites));
      setVerifyIsFavorite(false);
    } else {
      const setFavoritesLocalStorage = [...favorites, {
        id: recipeObjectMeal.idMeal,
        type: 'meal',
        nationality: recipeObjectMeal.strArea,
        category: recipeObjectMeal.strCategory,
        alcoholicOrNot: '',
        name: recipeObjectMeal.strMeal,
        image: recipeObjectMeal.strMealThumb,
      }];
      setFavorites(setFavoritesLocalStorage);
      localStorage.setItem('favoriteRecipes', JSON.stringify(setFavoritesLocalStorage));
      setVerifyIsFavorite(true);
    }
  };

  return (
    <div className="detail-meal">
      { recipeArrayMeal
        .map(
          ({
            idMeal, strMeal, strCategory, strInstructions, strMealThumb, strYoutube,
          }) => (
            <div className="detail-meal" key={ idMeal }>
              <h3
                className="title is-3"
                data-testid="recipe-title"
              >
                {strMeal}
              </h3>
              <img
                className="img-detail"
                src={ strMealThumb }
                alt={ strMeal }
                data-testid="recipe-photo"
              />
              <p data-testid="recipe-category">
                {`Category: ${strCategory}`}
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
                  onClick={ handleClick }
                  type="button"
                  data-testid="favorite-btn"
                  src={ verifyIsFavorite ? blackHeartIcon : whiteHeartIcon }
                >
                  <img
                    src={ verifyIsFavorite ? blackHeartIcon : whiteHeartIcon }
                    alt={ verifyIsFavorite ? 'blackHeartIcon' : 'whiteHeartIcon' }
                  />

                </button>
              </div>
              <span>{ clipboard }</span>
              <div className="content">
                <h6
                  className="title is-6"
                  data-testid="recipe-title"
                >
                  Instructions:
                </h6>
                <span
                  data-testid="instructions"
                >
                  {strInstructions}
                </span>
              </div>
              <div className="video-container">
                <h6
                  className="title is-6"
                  data-testid="recipe-title"
                >
                  Video tutorial:
                </h6>
                <iframe
                  title={ `Receita: ${strMeal}` }
                  allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                  allowFullScreen
                  src={ strYoutube.replace('watch?v=', 'embed/') }
                  data-testid="video"
                />
              </div>
            </div>
          ),
        )}
      <div className="content">
        <h6
          className="title is-6"
          data-testid="recipe-title"
        >
          Ingredients:
        </h6>
        <div className="ingredients-container">
          <div>
            {
              getMeasures.map((measure, index) => (
                <p
                  id="right"
                  key={ index }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  { measure[1] }
                </p>
              ))
            }
          </div>
          <div>
            {
              getIngredients.map((ingredient, index) => (
                <p
                  id="left"
                  key={ index }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  {` ${ingredient[1]}`}
                </p>
              ))
            }
          </div>
        </div>
      </div>

      <div className="carousel">
        <h6
          className="title is-6"
          data-testid="recipe-title"
        >
          Recommendations:
        </h6>
        <Recommendations data={ dataDrinks } pageTypes="drinks" />
      </div>

      <div className="margin-button-div">
        <button
          type="button"
          className="button is-link is-rounded"
          data-testid="start-recipe-btn"
          onClick={ () => history.push(`${pathname}/in-progress`) }
        >
          {
            verifyInProgress ? 'Continue Recipe' : 'Start Recipe'
          }
        </button>
      </div>

    </div>
  );
}

MealDetails.propTypes = {
  pathname: PropTypes.func,
}.isRequired;

export default MealDetails;
