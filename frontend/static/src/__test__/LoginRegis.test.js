import { render, unmountComponentAtNode } from 'react-dom';
import LoginRegis from '../components/login_regis/LoginRegis';

describe ('LoginRegis', () => {
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
        render(<LoginRegis/>, container);
        expect(container.querySelector('div')).not.toBeNull()
    })
})