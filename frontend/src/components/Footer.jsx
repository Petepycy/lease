import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="footer__menu">
          <ul className="footer__menu-list">
            <li className="footer__menu-item">
              <p className="footer__menu-title">Products</p>
            </li>
            <li className="footer__menu-item">
              <Link to="/pre-owned" className="footer__menu-link">
                Used
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/new-cars" className="footer__menu-link">
                New
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/sell" className="footer__menu-link">
                Sell your car
              </Link>
            </li>
          </ul>
          <ul className="footer__menu-list">
            <li className="footer__menu-item">
              <p className="footer__menu-title">Resources</p>
            </li>
            <li className="footer__menu-item">
              <Link to="/blog" className="footer__menu-link">
                Blog
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/faq" className="footer__menu-link">
                FAQ
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/contacts" className="footer__menu-link">
                Contact us
              </Link>
            </li>
          </ul>
          <ul className="footer__menu-list">
            <li className="footer__menu-item">
              <p className="footer__menu-title">Work With TrueCar</p>
            </li>
            <li className="footer__menu-item">
              <Link to="/dealers" className="footer__menu-link">
                Dealers
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/partners" className="footer__menu-link">
                Partners
              </Link>
            </li>
          </ul>
          <ul className="footer__menu-list">
            <li className="footer__menu-item">
              <p className="footer__menu-title">About</p>
            </li>
            <li className="footer__menu-item">
              <Link to="/about" className="footer__menu-link">
                About us
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/team" className="footer__menu-link">
                Team
              </Link>
            </li>
            <li className="footer__menu-item">
              <Link to="/careers" className="footer__menu-link">
                Careers
              </Link>
            </li>
          </ul>
        </nav>
        <ul className="app">
          <li className="app__item">
            <a href="#" className="app__item-link">
              <img
                src="/images/appstore.svg"
                alt="App Store"
                className="app__item-img"
              />
            </a>
          </li>
          <li className="app__item">
            <a href="#" className="app__item-link">
              <img
                src="/images/googleplay.svg"
                alt="Google Play"
                className="app__item-img"
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer; 