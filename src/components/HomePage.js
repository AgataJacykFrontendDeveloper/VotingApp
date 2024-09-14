import "./HomePage.css";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [pollTimestamp, setPollTimestmap] = useState(null);
  const [pollActive, setPollActive] = useState(true);

  useEffect(() => {
    const getPollRemainingTime = async () => {
      const pollsCollectionRef = collection(db, "polls");
      const latestPollQuery = query(
        pollsCollectionRef,
        where("type", "==", "weekly"),
        orderBy("start_at", "desc"),
        limit(1)
      );
      const latestPoll = await getDocs(latestPollQuery);
      if (!latestPoll.empty) {
        const latestPollDoc = latestPoll.docs[0];
        const endTime = latestPollDoc.data().end_at.seconds;
        setPollTimestmap(endTime);
        setPollActive(true);
      }
    };
    getPollRemainingTime();
  }, []);

  useEffect(() => {
    if (!pollTimestamp) return;

    const calculateRemainingTime = () => {
      const now = new Date().getTime() / 1000;
      const endTime = pollTimestamp;
      const timeDiff = endTime - now;

      if (timeDiff <= 0) {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setPollActive(false);
        return;
      }

      const days = Math.floor(timeDiff / (24 * 60 * 60));
      const hours = Math.floor((timeDiff % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
      const seconds = Math.floor(timeDiff % 60);

      setRemainingTime({ days, hours, minutes, seconds });
    };

    calculateRemainingTime();

    const timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [pollTimestamp]);

  return (
    <>
      <section id="hero" className="container-fluid">
        <img
          src={require("../images/concert.png")}
          alt="hero-background"
          id="hero-background"
        />
        <div id="hero-text">
          <img
            src={require("../images/VotingAppLogo.png")}
            alt="hero-logo"
            className="hero-logo"
          />
          <h4>Głosuj na ulubione utwory co tydzień i co miesiąc</h4>
          <Link to="vote/weekly" className="btn-cyan">
            Zacznij głosować już teraz!
          </Link>
        </div>
        <img
          id="rock-star"
          src={require("../images/rockStar.png")}
          alt="rockstar"
        ></img>
      </section>
      <section id="player">
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="d-flex flex-column justify-content-center  align-items-center">
                <img
                  src={require("../images/MusicOfTheMonth.png")}
                  className="music-player"
                  alt="Posłuchaj utworu wybranego w marcu"
                />
                <h3>Posłuchaj piosenki wybranej w marcu</h3>
              </div>
            </div>
            <div className="carousel-item">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  src={require("../images/MusicOfTheMonth.png")}
                  className="music-player"
                  alt="Posłuchaj utworu wybranego w kwietniu"
                />
                <h3>Posłuchaj piosenki wybranej w kwietniu</h3>
              </div>
            </div>
            <div className="carousel-item">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  src={require("../images/MusicOfTheMonth.png")}
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
      </section>
      <section
        id="counting"
        className="d-flex flex-column justify-content-center"
      >
        <h3>Do następnego głosowania pozostało</h3>
        {pollTimestamp && !pollActive ? (
          <h1>Głosowanie dobiegło końca</h1>
        ) : (
          <h1>
            {remainingTime.days} dni {remainingTime.hours} h{" "}
            {remainingTime.minutes} min {remainingTime.seconds} s
          </h1>
        )}
        <Link to="vote/weekly" className="btn-cyan">
          Głosuj w najbliższym głosowaniu
        </Link>
      </section>
    </>
  );
};

export default HomePage;
