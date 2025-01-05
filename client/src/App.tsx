import Header from "./components/Header";
import StartMenu from "./components/StartMenu";
import "./App.css";

function App() {
    const title = "Star Wars Villainous";
    const imagePath = "../../logo.jpg";

    const villains = ["Moff Gideon", "General Grievous", "Darth Vader"];

    return (
        <>
            <Header title={title} imagePath={imagePath} />
            <div className="startMenu">
                <StartMenu
                    villains={villains}
                    onStartButtonClick={(playerVillain, opponentVillain) => {
                        console.log(playerVillain + ", " + opponentVillain);
                    }}
                />
            </div>
        </>
    );
}

export default App;
