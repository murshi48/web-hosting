import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";

/* fallback local videos */
const localVideos = {
  Linux: "/sample-video.mp4",
  Terraform: "/covervideo.mp4",
  AWS: "/sample-video.mp4",
  Docker: "/covervideo.mp4",
  Jenkins: "/sample-video.mp4",
  Kubernetes: "/covervideo.mp4",
  Ansible: "/sample-video.mp4",
  Git: "/covervideo.mp4",
};

export default function Dashboard() {
  const [skills, setSkills] = useState(Object.keys(localVideos));
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [currentSkill, setCurrentSkill] = useState("Linux");
  const [currentVideo, setCurrentVideo] = useState(localVideos["Linux"]);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const playerRef = useRef(null);

  /* LOAD STUDENTS + VIDEOS */
  useEffect(() => {
    // load students
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => console.warn("Users not loaded"));

    // load videos
    fetch("http://localhost:5000/videos")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const titles = data.map(v => v.title);
          setSkills(titles);
          setCurrentSkill(titles[0]);
          setCurrentVideo(`http://localhost:5000/uploads/${data[0].filename}`);
        }
      })
      .catch(() => console.warn("Videos not loaded"));
  }, []);

  /* CHANGE VIDEO WHEN SKILL CHANGES */
  useEffect(() => {
    fetch("http://localhost:5000/videos")
      .then(res => res.json())
      .then(data => {
        const match = data.find(v => v.title === currentSkill);
        if (match) {
          setCurrentVideo(`http://localhost:5000/uploads/${match.filename}`);
        } else {
          setCurrentVideo(localVideos[currentSkill] || "/sample-video.mp4");
        }
      });
  }, [currentSkill]);

  const filteredSkills = skills.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const togglePlay = () => {
    if (!playerRef.current) return;
    playerRef.current.paused
      ? playerRef.current.play()
      : playerRef.current.pause();
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    setCommentList([{ text: comment, time: new Date() }, ...commentList]);
    setComment("");
  };

  return (
    <div className="dashboard-container">
      <video className="dashboard-bg-video" autoPlay loop muted>
        <source src="/backgroundvideo.mp4" type="video/mp4" />
      </video>

      <div className="dashboard-overlay" />

      <div className="dashboard-content">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>Subjects</h3>

          <input
            className="search-input"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filteredSkills.map(skill => (
            <button
              key={skill}
              className={`side-item ${skill === currentSkill ? "active-item" : ""}`}
              onClick={() => setCurrentSkill(skill)}
            >
              {skill}
            </button>
          ))}

          <div className="student-card">
            <h4>Students</h4>
            {students.map((s, i) => (
              <div key={i} className="student-row">
                {s.username}
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-page">
          <h1>{currentSkill}</h1>

          <div className="video-card">
            <button onClick={togglePlay}>▶ / ❚❚</button>

            <video
              ref={playerRef}
              key={currentVideo}
              className="video-player-large"
              controls
            >
              <source src={currentVideo} type="video/mp4" />
            </video>
          </div>

          <div className="comment-box">
            <textarea
              placeholder="Ask doubt..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Submit</button>

            {commentList.map((c, i) => (
              <div key={i}>
                <b>{c.text}</b>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
