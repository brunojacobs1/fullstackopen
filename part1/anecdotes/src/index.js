import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const VoteCount = ({ votes }) => <p>has {votes} votes</p>;

const HighestVoted = ({ anecdotes, points }) => {
  const highest = Math.max(...points);
  const position = points.indexOf(highest);
  if (highest === 0) {
    return <p>Start voting!</p>;
  }

  return (
    <>
      {anecdotes[position]}
      <VoteCount votes={highest} />
    </>
  );
};

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length));

  const handleClickVote = () => {
    const pointsCopy = [...points];
    pointsCopy[selected] += 1;
    setPoints(pointsCopy);
  };

  const handleClickNext = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <VoteCount votes={points[selected]} />
      <div>
        <Button onClick={handleClickVote} text="Vote" />
        <Button onClick={handleClickNext} text="Next anecdote" />
      </div>
      <h1>Anecdote with most votes</h1>
      <HighestVoted anecdotes={anecdotes} points={points} />
    </div>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));
