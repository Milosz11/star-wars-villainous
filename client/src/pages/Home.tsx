import { Link } from "react-router";

function Home() {
    return (
        <div className="contentAreaWide col-auto">
            <div className="text-start">
                <h3>Hello There</h3>
                <p>
                    This is Star Wars Villainous in a browser! As a Star Wars fanatic, I recently
                    discovered the board game Star Wars Villainous and thought it would be a fun and
                    challenging project to put the card game in a browser. I wanted to gain real
                    world experience building a web app, while also flexing my functional
                    programming muscles. This project required me to design the game engine logic,
                    create a REST API, and develop a responsive user interface.
                </p>
                <p>Best,</p>
                <p className="mb-0">Milosz Dabrowski</p>
            </div>
            <div className="mt-4">
                <h2>Multiplayer</h2>
                <Link to="/lobby" state={{ ip: "localhost", restApiPort: "3000", wsPort: "4000" }}>
                    <button className="btn btn-primary me-2">Create Game Lobby</button>
                </Link>
                <Link to="/">
                    <button className="btn btn-primary ms-2">Join Game (NYI)</button>
                </Link>
                <h2>Singleplayer</h2>
                <Link to="/">
                    <button className="btn btn-primary me-2">Create Game (NYI)</button>
                </Link>
                <Link to="/">
                    <button className="btn btn-primary ms-2">Load Game (NYI)</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
