import styles from './App.module.css';
import themeStyles from './styles/Theme.module.css';
import MainContent from './components/MainContent';

function App() {
  return (
    <div className={`${themeStyles.appShell} ${styles.content}`}>
      <MainContent />
    </div>
  );
}

export default App;
