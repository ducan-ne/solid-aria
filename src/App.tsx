import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { Test } from './Test'

const App: Component = () => {
  return (
    <div>
      <header>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. 1234
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
      <hr/>
      <Test/>
    </div>
  );
};

export default App;
