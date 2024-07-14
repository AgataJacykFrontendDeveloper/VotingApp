import "./VotePage.css";
import useFetchSongs from "../hooks/useFetchSongs";
import useVoteSong from "../hooks/useVoteSong";

const VotePage = ({ type }) => {
  const voteType = type === "weekly" ? "Tygodnia" : "Miesiąca";
  const { isLoading, songs, currentPollId, setSongs } = useFetchSongs(type);
  const voteSong = useVoteSong(currentPollId, setSongs, voteType);

  return (
    <div className="d-flex flex-column align-items-center mx-4">
      <h1 className="text-white text-uppercase fs-2 mb-4 text-center">
        Zagłosuj na piosenkę {voteType}
      </h1>
      <ul className="list-unstyled fs-4 container-md d-flex flex-column gap-4 p-0">
        {!isLoading &&
          songs
            .sort((a, b) => b.votes - a.votes)
            .map((song, i) => (
              <div
                className="d-flex align-items-center gap-4 position-relative w-100"
                key={song.id}
              >
                {i === 0 && (
                  <img
                    src="/assets/images/stars.png"
                    alt="Najczęsciej głosowana piosenka"
                    className="stars"
                    width="50"
                  ></img>
                )}
                <p className="text-white fs-3 m-0">{i + 1}.</p>
                <li
                  className={`w-100 border border-2 border-success rounded-5 fs-6 m-0 p-2 p-sm-0 row align-items-center justify-content-center row-gap-2 me-4 overflow-hidden flex-wrap-reverse ${i === 0 ? "border-bottom-2 bg-top-vote-opaque" : "bg-vote-opaque"}`}
                >
                  <button
                    className="btn-heart py-1 px-3 w-auto col-12 col-sm-auto"
                    onClick={() => voteSong(song.id)}
                  >
                    {/*TODO: Change liked song to be &#9829 and not liked &#9825 */}
                    &#9829;
                  </button>
                  <div className="row col-12 col-sm justify-content-center m-0">
                    <div className="col-sm text-center text-sm-start row row-cols-1 column-gap-1">
                      <div className="col col-sm-auto px-0">{song.title}</div>
                      <div className="col col-sm-auto px-0">{song.artist}</div>
                    </div>
                    <small className="text-white col-auto text-nowrap me-0 me-sm-3 align-self-center">
                      Głosy: {song.votes}
                    </small>
                  </div>
                </li>
              </div>
            ))}
      </ul>
    </div>
  );
};

export default VotePage;
