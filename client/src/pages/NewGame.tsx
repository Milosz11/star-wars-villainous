import { useEffect, useState } from "react";
import { Link } from "react-router";
import SelectableMenu from "../components/SelectableMenu";

function NewGame() {
    const [villains, setVillains] = useState([]);

    const [selectedPlayerVillain, setSelectedPlayerVillain] = useState("");
    const [selectedOpponentVillain, setOpponentVillain] = useState("");

    const opponentMenuShown = selectedPlayerVillain != "";
    const startButtonDisabled = selectedPlayerVillain == "" || selectedOpponentVillain == "";

    useEffect(() => {
        const fetchData = async () => {
            const url = "http://localhost:3000/game/game-settings";
            const response = await fetch(url);
            const settings = await response.json();
            setVillains(settings["availableVillains"]);
        };
        fetchData();
    }, []);

    return (
        <div className="contentArea">
            <h3 className="mb-2">Choose Your Villain</h3>
            <SelectableMenu
                items={villains}
                onSelectItem={(villain) => {
                    setSelectedPlayerVillain(villain);
                }}
            />
            {opponentMenuShown && (
                <>
                    <h3 className="mt-4 mb-2">Select Your Opponent</h3>
                    <SelectableMenu
                        items={villains.filter((villain) => {
                            return villain != selectedPlayerVillain;
                        })}
                        onSelectItem={(villain) => {
                            setOpponentVillain(villain);
                        }}
                    />
                </>
            )}
            <div className="mt-4">
                <button
                    type="button"
                    className={"me-4 btn btn-primary" + (startButtonDisabled ? " disabled" : "")}
                    onClick={(_event) => {
                        console.log(selectedPlayerVillain + ", " + selectedOpponentVillain);
                        const socket = new WebSocket("ws://localhost:4000");
                        socket.addEventListener("open", (_event) => {
                            socket.send("Hello Server!");
                        });
                    }}
                >
                    Start Game
                </button>
                <Link to="/">
                    <button className="btn btn-secondary">Back</button>
                </Link>
            </div>
        </div>
    );
}

export default NewGame;
