import { render, unmountComponentAtNode } from 'react-dom';
import HomePage from "../components/home_page/HomePage";

describe('HomePage', () => {
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
        render(<HomePage/>, container);
        expect(container.querySelector('div')).not.toBeNull()
    })

    it('renders fetched data', () => {
        jest.spyOn(global, fetch)
    })
})