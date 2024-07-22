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

  console.log("Weekly Votes:", weeklyVotes);
  console.log("Monthly Votes:", monthlyVotes);

  const filterDuplicates = (votes, filterFunc) => {
    console.log("Filtering with votes:", votes);

    const filteredIds = new Set(votes.map((vote) => vote.songId));
    console.log("Filtered IDs:", filteredIds);

    const result = filterFunc((vote) => !filteredIds.has(vote.songId));
    console.log("Filter Result:", result);

    return result;
  };

  const filteredWeeklyVotes = filterDuplicates(weeklyVotes, (vote) => {
    const result = monthlyVotes.filter(
      (monthlyVote) => monthlyVote.songId !== vote.songId
    );
    console.log("Weekly Vote:", vote);
    console.log("Filtered Monthly Votes:", result);
    return result;
  });

  const filteredMonthlyVotes = filterDuplicates(monthlyVotes, (vote) => {
    const result = weeklyVotes.filter(
      (weeklyVote) => weeklyVote.songId !== vote.songId
    );
    console.log("Monthly Vote:", vote);
    console.log("Filtered Weekly Votes:", result);
    return result;
  });

  console.log("Filtered Weekly Votes:", filteredWeeklyVotes);
  console.log("Filtered Monthly Votes:", filteredMonthlyVotes);

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
