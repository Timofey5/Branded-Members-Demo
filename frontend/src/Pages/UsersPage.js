import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import ErrorModal from "../Components/UiElements/ErrorModal/ErrorModal";
import Button from "../Components/UiElements/FormElements/Button";
import LoadingSpinner from "../Components/UiElements/LoadingSpinner/LoadingSpinner";
import { AppContext } from "../Context/AppContext";

const UsersPage = () => {
  const {
    state: { token, usersData, error, loading },
    actions: { fetchUsers, clearError },
  } = useContext(AppContext);

  const [sortOrder, setSortOrder] = useState("");
  const [gt, setGt] = useState("");
  const [lt, setLt] = useState("");

  useEffect(() => {
    if (token) fetchUsers(token);
  }, [token, fetchUsers]);

  const sortFormSubmitHandler = (e) => {
    e.preventDefault();
    fetchUsers(token, sortOrder, gt, lt);
  };

  if (!token) {
    return <Redirect to="/auth" />;
  }

  if (!usersData) return <LoadingSpinner asOverlay />;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {loading && <LoadingSpinner asOverlay />}
      <div className="users-page__header">
        <h2>Welcome To Branded-Members App</h2>
      </div>
      <form className="filter">
        <div>
          <label htmlFor="sortOrder">Sort table By:</label>
          <select
            id="sortOrder"
            name="sortOrder"
            onChange={({ target: { value } }) => setSortOrder(value)}
          >
            <option value="name">Name: A-Z</option>
            <option value="high">Age: High {">"} Low</option>
            <option value="low">Age: Low {">"} High</option>
          </select>
        </div>
        <div>
          <label htmlFor="gt">Sort By Age Range</label>
        </div>
        <div>
          <input
            id="gt"
            type="number"
            placeholder="Min"
            value={gt}
            onChange={({ target: { value } }) => setGt(value)}
          />
          <span>-</span>
          <input
            id="lt"
            type="number"
            value={lt}
            placeholder="Max"
            onChange={({ target: { value } }) => setLt(value)}
          />
        </div>
        <div>
          <Button animated type="submit" onClick={sortFormSubmitHandler}>
            CONFIRM
          </Button>
        </div>
      </form>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th className="users-table__num">Num.</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}.</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
              </tr>
            ))}
            {/* <tr>
              <td>1</td>
              <td>asd</td>
              <td>asd</td>
            </tr>
            <tr>
              <td>2</td>
              <td>asd</td>
              <td>asd</td>
            </tr>
            <tr>
              <td>3</td>
              <td>asd</td>
              <td>asd</td>
            </tr>
            <tr>
              <td>4</td>
              <td>asd</td>
              <td>asd</td>
            </tr>
            <tr>
              <td>5</td>
              <td>asd</td>
              <td>asd</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default UsersPage;
