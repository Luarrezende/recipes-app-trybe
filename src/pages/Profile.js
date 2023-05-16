import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile() {
  const history = useHistory();
  const emailStorage = JSON.parse(localStorage.getItem('user'));
  const verifyEmail = () => {
    if (emailStorage && emailStorage.email) {
      const { email } = emailStorage;
      return email;
    }
  };

  const doneRecipesPush = () => {
    history.push('/done-recipes');
  };

  const favoriteRecipesPush = () => {
    history.push('/favorite-recipes');
  };

  const logout = () => {
    localStorage.clear();
    history.push('/');
  };
  return (
    <div>
      <Header title="Profile" searchIcon={ false } />
      <div className="container">
        <div className="email-show">
          <span className="white" data-testid="profile-email">{ verifyEmail() }</span>
        </div>
        <div className="center buttons-header flex-buttons">
          <div id="margin">
            <button
              className="button is-small is-rounded"
              type="button"
              data-testid="profile-done-btn"
              onClick={ doneRecipesPush }
            >
              Done Recipes
            </button>
          </div>
          <div id="margin">
            <button
              className="button is-small is-rounded"
              type="button"
              data-testid="profile-favorite-btn"
              onClick={ favoriteRecipesPush }
            >
              Favorite Recipes
            </button>
          </div>
          <div id="margin">
            <button
              className="button is-small is-rounded"
              type="button"
              data-testid="profile-logout-btn"
              onClick={ logout }
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
