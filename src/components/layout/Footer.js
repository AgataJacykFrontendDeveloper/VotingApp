import "./Footer.css";
const Footer = () => {
  return (
    <footer>
      <div id="newsletter-box">
        <p>
          Zapisz się do newslettera aby zawsze być na bieżąco z wynikami
          głosowania!
        </p>
        <input />
        <button className="white-btn">Zapisz się!</button>
      </div>
      <div className="footer-box">
        <div className="div1">Logo </div>
        <div className="div2">
          <ul>
            <li>Informacje o aplikacji</li>
            <li>Playlisty</li>
          </ul>
        </div>
        <div className="div3">
          <ul>
            <li>Warunki korzystania</li>
            <li>Polityka prywatności</li>
          </ul>
        </div>
        <div className="div4">
          <ul>
            <li>FAQs</li>
            <li>Pomoc techniczna</li>
          </ul>
        </div>
        <div id="copy">
          <span>&copy; Copyrights WEB4PRO</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
