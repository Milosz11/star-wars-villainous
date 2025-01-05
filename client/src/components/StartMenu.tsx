import { useState } from "react";
import SelectableMenu from "./SelectableMenu";

interface Props {
    villains: string[];
    onStartButtonClick: (playerVillain: string, opponentVillain: string) => void;
}

function StartMenu({ villains, onStartButtonClick }: Props) {
    const [selectedPlayerVillain, setSelectedPlayerVillain] = useState("");
    const [selectedOpponentVillain, setOpponentVillain] = useState("");

    const opponentMenuShown = selectedPlayerVillain != "";
    const startButtonDisabled = selectedPlayerVillain == "" || selectedOpponentVillain == "";

    return (
        <>
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
            <button
                type="button"
                className={"mt-4 btn btn-primary" + (startButtonDisabled ? " disabled" : "")}
                onClick={(_event) =>
                    onStartButtonClick(selectedPlayerVillain, selectedOpponentVillain)
                }
            >
                Start Game
            </button>
        </>
    );
}

export default StartMenu;
