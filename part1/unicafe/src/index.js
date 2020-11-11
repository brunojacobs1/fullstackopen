import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Display = ({ text }) => <h1>{text}</h1>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Statistic = ({ name, value }) => (
  <>
    <tr>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  </>
);

const Statistics = ({ statistics }) => {
  if (statistics[3].value > 0) {
    return (
      <>
        <Display text="Statistics" />
        <table>
          <tbody>
            <Statistic key={0} name="Good" value={statistics[0].value} />
            <Statistic key={1} name="Neutral" value={statistics[1].value} />
            <Statistic key={2} name="Bad" value={statistics[2].value} />
            <Statistic key={3} name="All" value={statistics[3].value} />
            <Statistic key={4} name="Average" value={statistics[4].value} />
            <Statistic key={5} name="Positive" value={statistics[5].value} />
          </tbody>
        </table>
      </>
    );
  }
  return <p>Start giving feedback to display the statistics</p>;
};

const App = () => {
  const [good, setStateGood] = useState(0);
  const [neutral, setStateNeutral] = useState(0);
  const [bad, setStateBad] = useState(0);
  const all = good + neutral + bad;
  const average = all > 0 ? (good - bad) / all : 0;
  const positive = `${all > 0 ? (good / all) * 100 : 0} %`;
  const statistics = [
    {
      name: 'Good',
      value: good,
    },
    {
      name: 'Neutral',
      value: neutral,
    },
    {
      name: 'Bad',
      value: bad,
    },
    {
      name: 'All',
      value: all,
    },
    {
      name: 'Average',
      value: average,
    },
    {
      name: 'Positive',
      value: positive,
    },
  ];

  const handleGoodClick = () => {
    setStateGood(good + 1);
  };

  const handleNeutralClick = () => {
    setStateNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setStateBad(bad + 1);
  };

  return (
    <div>
      <Display text="Give feedback" />
      <Button onClick={handleGoodClick} text="Good" />
      <Button onClick={handleNeutralClick} text="Neutral" />
      <Button onClick={handleBadClick} text="Bad" />
      <Statistics statistics={statistics} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
