/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from './logo.svg';
import { useState, useEffect } from 'react';
import Todo from './todos.js';
import About from './about.js';
import Page404 from './page404.js';

function App() {
  let [title, setTitle] = useState('Connie Playground');
  let [todos, setTodos] = useState([]);
  let [page, setPage] = useState('todo');

  useEffect(() => {
    console.log('useEffect');
  }, [todos]);

  return (
    <div className="App">
      <header className="App-header">{title}</header>
      <button
        onClick={() => {
          setTitle('New Title');
        }}
      >
        Change title
      </button>
      <button
        onClick={() => {
          let newTodos = [...todos];
          newTodos.push(`job ${newTodos.length}`);
          setTodos(newTodos);
        }}
      >
        Add job
      </button>
      <ul>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage('todo');
            }}
          >
            TODO page
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage('about');
            }}
          >
            About page
          </a>
        </li>
      </ul>
      {(() => {
        switch (page) {
          case 'todo':
            return <Todo todos={todos} />;
          case 'about':
            return <About />;
          default:
            return <Page404 />;
        }
      })()}
    </div>
  );
}

export default App;
