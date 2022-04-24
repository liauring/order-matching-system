import { useState, useEffect } from 'react';

const divStyle = {
  width: '100%',
  height: '600px',
  backgroundColor: '#f0f0f0',
};

function Todo({ todos }) {
  useEffect(() => {
    console.log('useEffect');
  }, [todos]);

  return (
    <div style={divStyle}>
      <h2>This is Todo list</h2>
      <ul>
        {todos.map((todo) => {
          return <li>{todo}</li>;
        })}
      </ul>
    </div>
  );
}

export default Todo;
