import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EncounterList from './pages/EncounterList';
import NewEncounter from './pages/NewEncounter';
import EncounterDetail from './pages/EncounterDetail';

function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/encounters" component={EncounterList} />
            <Route exact path="/encounters/new" component={NewEncounter} />
            <Route path="/encounters/:id" component={EncounterDetail} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
