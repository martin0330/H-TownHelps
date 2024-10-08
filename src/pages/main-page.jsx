import React from "react";
import { Link } from "react-router-dom";

function MainPage() {
  return (
    <div>
      <h1>Welcome to H-TownHelps!</h1>
      <p>Manage your events, match with volunteer opportunities, and more.</p>

      <div className="main-page-links">
        <ul>
          <li>
            <Link to="/eventmanage">Manage Events</Link>
          </li>
          <li>
            <Link to="/volunteermatch">Volunteer Matching</Link>
          </li>
          <li>
            <Link to="/notifications">View Notifications</Link>
          </li>
          <li>
            <Link to="/volunteerhist">Volunteer History</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
