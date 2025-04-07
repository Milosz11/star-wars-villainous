import GameCard, { GameCardProps } from "./GameCard";

export enum GameCardGroupPeekOption {
    Staircase,
    VerticalStack,
}

export enum GameCardGroupHoverRevealOption {
    Arc,
    Row,
}

export interface GameCardGroupProps {
    gameCards: GameCardProps[];
    isFaceUp: boolean;
    numberCardsPeeking: Number | null;
    peekOption: GameCardGroupPeekOption | null;
    hoverRevealOption: GameCardGroupHoverRevealOption | null;
}

function GameCardGroup({
    gameCards,
    isFaceUp,
    numberCardsPeeking,
    peekOption,
    hoverRevealOption,
}: GameCardGroupProps) {
    return (
        <>
            {gameCards}
            {isFaceUp}
            {numberCardsPeeking}
            {peekOption}
            {hoverRevealOption}
        </>
    );
}

export default GameCardGroup;
