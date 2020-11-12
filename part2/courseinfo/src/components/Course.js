import React from 'react';

const Header = ({ courseName }) => <h2>{courseName}</h2>;

const Part = ({ partName, numberOfExercises }) => (
  <p>
    {partName} {numberOfExercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part
        key={part.id}
        partName={part.name}
        numberOfExercises={part.exercises}
      />
    ))}
  </>
);

const Total = ({ parts }) => (
  <b>Total of {parts.reduce((sum, x) => sum + x.exercises, 0)} exercises</b>
);

const Course = ({ courses }) => (
  <div>
    <h1>Web development curriculum</h1>
    {courses.map((c) => {
      return (
        <div key={c.id}>
          <Header courseName={c.name} />
          <Content parts={c.parts} />
          <Total parts={c.parts} />
        </div>
      );
    })}
  </div>
);

export default Course;
