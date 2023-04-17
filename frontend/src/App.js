import { React, useState, useEffect } from "react";
import "./App.css";
import axios from 'axios'

function App() {
  const [courses, setCourses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    // Retrieve the list of courses from the API
    axios
      .get("/api/courses")
      .then((response) => setCourses(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSubscribe = (courseId) => {
    const userId = 123; // Replace with the user's ID
    axios
      .post("/api/subscribe", { userId, courseId })
      .then((response) => {
        setSubscriptions([...subscriptions, response.data]);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.name} - ${course.price}{" "}
            <button onClick={() => handleSubscribe(course.id)}>
              Subscribe
            </button>
          </li>
        ))}
      </ul>
      <h1>Subscriptions</h1>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription._id}>
            {subscription.courseId} - Expires on{" "}
            {new Date(subscription.expirationDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
