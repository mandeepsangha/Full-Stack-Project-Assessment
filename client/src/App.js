import "./App.css";
import React, { useState, useEffect } from "react";
// import Moment from "moment";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayVideo, setDisplayVideo] = useState([]);
  const [newVidTitle, setNewVidTitle] = useState("");
  const [newVidUrl, setNewVidUrl] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setDisplayVideo(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const addVideo = {
      rating: 0,
      title: newVidTitle,
      url: newVidUrl,
      date: Date(),
      id: displayVideo.length,
    };
    fetch("http://localhost:5000/", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addVideo),
    });

    setDisplayVideo([...displayVideo, addVideo]);
    setNewVidTitle("");
    setNewVidUrl("");
  };

  const videoCountPlus = (id) => {
    const newCounterVideo = displayVideo.map((card) =>
      card.id === id ? { ...card, rating: card.rating + 1 } : card
    );
    setDisplayVideo(newCounterVideo);
  };

  const videoCountMinus = (id) => {
    const newCounterVideo = displayVideo.map((card) =>
      card.id === id ? { ...card, rating: card.rating - 1 } : card
    );
    setDisplayVideo(newCounterVideo);
  };

  const handleRemoveItem = (id) => {
    fetch(`http://localhost:5000/videos/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 200) {
        let filteredVideos = displayVideo.filter((video) => video.id !== id);
        setDisplayVideo(filteredVideos);
      }
    });
  };

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <h1>Video Recommendation</h1>
        </header>
      </div>
      <div>
        <div>
          Hi i'm a Search Bar
          <input
            className="searchbar"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div>
        <div>Add video</div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className="inputBar"
            type="text"
            name="title"
            value={newVidTitle}
            onChange={(e) => setNewVidTitle(e.target.value)}
          />{" "}
          Title
          <input
            className="inputBar"
            type="text"
            name="url"
            value={newVidUrl}
            onChange={(e) => setNewVidUrl(e.target.value)}
          />{" "}
          URL
          <button type="submit">Submit Form</button>
          <p></p>
        </form>
      </div>

      <div>
        <ul className="card-container">
          {displayVideo
            .filter((card) => {
              const { title, id } = card;
              if (title) {
                const searchTermMatches = title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
                return searchTermMatches;
              }
            })
            .sort((a, b) =>
              b.rating > a.rating ? 1 : a.rating > b.rating ? -1 : 0
            )
            .map((card) => (
              <li className="card">
                <h2>{card.title}</h2>
                <p>
                  {" "}
                  {
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        card.url.split("v=").pop().split("&")[0]
                      }`}
                      title="YouTube video player"
                      frameBorder="0"
                    ></iframe>
                  }
                </p>
                <p>{card.rating}</p>
                <div className="button-container">
                  <button onClick={() => videoCountPlus(card.id)}>
                    Up Vote
                  </button>
                  <button onClick={() => videoCountMinus(card.id)}>
                    Down Vote
                  </button>
                </div>
                <div>
                  <button onClick={() => handleRemoveItem(card.id)}>
                    Delete this video
                  </button>
                </div>
                <div>{card.date ? card.date : ""}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
