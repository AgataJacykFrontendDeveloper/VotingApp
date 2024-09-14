import React from "react";
import useFetchVotes from "../hooks/useFetchVote";
import { useAuth } from "../context/AuthProvider";

const UserVotes = () => {
  const { user } = useAuth();
  const userId = user ? user.uid : null;

  const { isLoading, weeklyVotes, monthlyVotes } = useFetchVotes(userId);

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  const filterDuplicates = (votes, filterFunc) => {
    const filteredIds = new Set(votes.map((vote) => vote.songId));
    const result = filterFunc((vote) => !filteredIds.has(vote.songId));
    return result;
  };

  const filteredWeeklyVotes = filterDuplicates(weeklyVotes, (vote) => {
    const result = monthlyVotes.filter(
      (monthlyVote) => monthlyVote.songId !== vote.songId
    );
    return result;
  });

  return (
    <div>
      <div className="votes-section">
        {filteredWeeklyVotes.length === 0 ? (
          <p>Brak głosów, zmień to - zagłosuj już teraz!</p>
        ) : (
          <ul className="votes-list">
            {filteredWeeklyVotes.map((weeklyVotes) => (
              <li key={weeklyVotes.voteId} className="vote-item">
                <strong>{weeklyVotes.title}</strong> by{" "}
                <em>{weeklyVotes.artist}</em> - <span>{weeklyVotes.genre}</span>
                <br />
                Głos oddany:{" "}
                {new Date(
                  weeklyVotes.timestamp.seconds * 1000
                ).toLocaleDateString("pl-PL")}{" "}
                o{" "}
                {new Date(
                  weeklyVotes.timestamp.seconds * 1000
                ).toLocaleTimeString("pl-PL")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserVotes;
