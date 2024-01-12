import { Link } from "react-router-dom";
function SideBar({ user }) {
  const { user_scope = "admin" } = user;
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {!["HOD", "CLUB", "STAFF"].includes(user_scope) && (
          <>
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/users">
                <i className="bi bi-person"></i>
                <span>Users</span>
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link collapsed"
                data-bs-target="#components-nav"
                data-bs-toggle="collapse"
                href="javascript:void(0)"
              >
                <i className="bi bi-menu-button-wide"></i>
                <span>Features</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="components-nav"
                className="nav-content collapse "
                data-bs-parent="#sidebar-nav"
              >
                <li>
                  <Link to="/departments">
                    <span>Departments</span>
                  </Link>
                </li>
                <li>
                  <Link to="/programs">
                    <span>Programs</span>
                  </Link>
                </li>
                <li>
                  <Link to="/papers">
                    <span>Papers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/batch">
                    <span>Batch</span>
                  </Link>
                </li>
                <li>
                  <Link to="/clubs">
                    <span>Clubs</span>
                  </Link>
                </li>
                <li>
                  <Link to="/students">
                    <span>Students</span>
                  </Link>
                </li>
                <li>
                  <Link to="/select-box">
                    <span>Select Box List</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a
                className="nav-link collapsed"
                data-bs-target="#forms-nav"
                data-bs-toggle="collapse"
                href="javascript:void(0)"
              >
                <i className="bi bi-journal-text"></i>
                <span>Admin Tools</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="forms-nav"
                className="nav-content collapse "
                data-bs-parent="#sidebar-nav"
              >
                <li>
                  <Link to="/settings">
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/criterion-settings">
                    <span>Criterion Settings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/view-score">
                    <span>View Score</span>
                  </Link>
                </li>
                <li>
                  <Link to="/data-backup">
                    <span>Data Backup</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link collapsed" to="/reports">
                <i className="bi bi-card-list"></i>
                <span>Reports</span>
              </Link>
            </li>
          </>
        )}

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/all-criterions">
            <i className="bi bi-box-arrow-in-right"></i>
            <span>All Criterions</span>
          </Link>
        </li>

        {!["HOD", "CLUB", "STAFF"].includes(user_scope) && (
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/events">
              <i className="bi bi-file-earmark"></i>
              <span>Events</span>
            </Link>
          </li>
        )}

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/summary">
            <i className="bi bi-dash-circle"></i>
            <span>Summary</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/student-list">
            <i className="bi bi-file-earmark"></i>
            <span>Student List</span>
          </Link>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#icons-nav"
            data-bs-toggle="collapse"
            href="javascript:void(0)"
          >
            <i className="bi bi-gem"></i>
            <span>Others</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="icons-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            {!["HOD", "CLUB", "STAFF"].includes(user_scope) && (
              <li>
                <Link to="/noticeboard">
                  <span>Notice Board</span>
                </Link>
              </li>
            )}
            <li>
              <Link to="/faq">
                <span>FAQ</span>
              </Link>
            </li>
            <li>
              <Link to="/about-us">
                <span>About Us</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}

export default SideBar;
