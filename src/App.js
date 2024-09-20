import { Outlet, Link } from "react-router-dom";

function App() {
  return(
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Login Page</Link>
          </li>
          <li>
            <Link to="/registration">Registration Page</Link>
          </li>
          <li>
            <Link to="/userprofile">User Profile Page</Link>
          </li>
          <li>
            <Link to="/eventmanage">Event Management Page</Link>
          </li>
          <li>
            <Link to="/volunteermatch">Volunteer Matching Page</Link>
          </li>
          <li>
            <Link to="/notifications">Notifications Page</Link>
          </li>
          <li>
            <Link to="/volunteerhist">Volunteer History Page</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default App;

