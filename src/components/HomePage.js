import "./HomePage.css";
import Logo from "../images/VotingAppLogo.png";
import musicPalyer from "../images/MusicOfTheMonth.png";

const HomePage = () => {
  return (
    <>
      <section id="hero" class="container-fluid">
        <div id="hero-text">
          <img src={Logo} className="hero-logo" />
          <h4>Głosuj na ulubione utwory co tydzień i co miesiąc</h4>
          <button className="btn-cyan">Zacznij głosować już teraz!</button>
        </div>
      </section>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="d-flex flex-column justify-content-center  align-items-center">
              <img
                src={musicPalyer}
                className="music-player"
                alt="Posłuchaj utworu wybranego w marcu"
              />
              <h3>Posłuchaj piosenki wybranej w marcu</h3>
            </div>
          </div>
          <div className="carousel-item">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <img
                src={musicPalyer}
                className="music-player"
                alt="Posłuchaj utworu wybranego w kwietniu"
              />
              <h3>Posłuchaj piosenki wybranej w kwietniu</h3>
            </div>
          </div>
          <div className="carousel-item">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <img
                src={musicPalyer}
                className="music-player"
                alt="Posłuchaj utworu wybranego w maju"
              />
              <h3>Posłuchaj piosenki wybranej w maju</h3>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <section id="counting" class="d-flex flex-column justify-content-center">
        <h3>Do następnego głosowania pozostało</h3>
        <h1>3 dni 19 h 35 min 54 s </h1>
        <button className="btn-cyan">Głosuj w najbliższym głosowaniu</button>
      </section>
    </>
  );
};

export default HomePage;
