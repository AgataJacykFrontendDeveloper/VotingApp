const VotesDisplay = ({ votes }) => {
  return (
    <div>
      <h4>Głosy:</h4>
      <ul>
        {votes.map((vote, index) => (
          <li key={index}>
            <strong>
              {vote.songArtist} - {vote.songTitle} (Całkowita liczba głosów:{" "}
              {vote.songVotes})
            </strong>
            <ul>
              {Array.isArray(vote.usersVoted) && vote.usersVoted.length > 0 ? (
                vote.usersVoted.map((user, userIndex) => (
                  <li key={userIndex}>
                    {user.userEmail} ({user.userTimeStamp})
                  </li>
                ))
              ) : (
                <li>Brak głosów na ten utwór.</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotesDisplay;
