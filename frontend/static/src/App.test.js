import { render, unmountComponentAtNode } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App'

describe('App', () => {
  let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('renders container', () => {
      expect(document.querySelector('div')).not.toBeNull()
    })

    it('renders a div', () => {
      render(
      <BrowserRouter>
        <App />
      </BrowserRouter>, container);
      expect(container.querySelector('div')).not.toBeNull()
  })
})
