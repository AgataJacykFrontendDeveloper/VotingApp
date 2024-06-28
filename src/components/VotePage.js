import { useState } from "react";

const VotePage = ({ type }) => {
  const [songs, setSongs] = useState([
    { id: 1, title: "Song A", artist: "Artist 1" },
    { id: 2, title: "Song B", artist: "Artist 2" },
    { id: 3, title: "Song C", artist: "Artist 3" },
  ]);

  const voteType = () => {
    return type === "weekly" ? "Tygodnia" : "Miesiąca";
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="text-white text-uppercase fs-2">
        Zagłosuj na piosenkę {voteType()}
      </h1>
      <ul className="list-unstyled fs-4 w-75 d-flex flex-column gap-4">
        {songs.map((song, i) => (
          <div className="d-flex">
            <span className="text-white fs-3">{i + 1}.</span>
            <li
              key={song.id}
              className="border border-success rounded-5 w-100 p-2 fs-6"
            >
              {song.id} {song.title} {song.artist}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default VotePage;
