const App = () => {
  return React.createElement('div', null, 'Website loaded with React');
};

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(React.createElement(App));
