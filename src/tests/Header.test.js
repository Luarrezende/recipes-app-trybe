import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import Meals from '../pages/Meals';
import Provider from '../contexts/MyProvider';

describe('Testa componente Header', () => {
  test('Verifica se botão profile envia para rota "/profile"', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Meals />
      </Provider>,
    );

    const buttonProfile = screen.getByRole('button', {
      name: /perfil/i,
    });

    userEvent.click(buttonProfile);

    const { pathname } = history.location;

    await waitFor(() => {
      expect(pathname).toBe('/profile');
    });
  });
  test('Verifica se botão search renderiza um input', async () => {
    renderWithRouter(
      <Provider>
        <Meals />
      </Provider>,
    );

    const buttonSearch = screen.getByTestId('search-button');

    userEvent.click(buttonSearch);

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
  });
});
