import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios_client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setNotification } = useStateContext();
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setUser(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrors(error.response.data.errors);
        });
    }, []);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          setNotification("User was successfully updated");
          navigate("/users");
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/users", user)
        .then(() => {
          setNotification("User was successfully created");
          navigate("/users");
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };
  return (
    <div className="card animated fadeInDown">
      {user.id && <h1>Update user : {user.name}</h1>}
      {!user.id && <h1>New user</h1>}
      &nbsp;
      <div className="animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
      </div>
      {errors && (
        <div>
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            onChange={(ev) => setUser({ ...user, name: ev.target.value })}
            value={user.name}
            placeholder="Name"
          />
          <input
            name="email"
            onChange={(ev) => setUser({ ...user, email: ev.target.value })}
            value={user.email}
            type="email"
            placeholder="Email"
          />
          <input
            name="password"
            onChange={(ev) => setUser({ ...user, password: ev.target.value })}
            value={user.password}
            type="password"
            placeholder="Password"
          />
          <input
            name="password_confirmation"
            onChange={(ev) =>
              setUser({ ...user, password_confirmation: ev.target.value })
            }
            value={user.password_confirmation}
            type="password"
            placeholder="Password Confirmation"
          />

          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      )}
    </div>
  );
}
