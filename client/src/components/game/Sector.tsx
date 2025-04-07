import GameCardGroup, {
    GameCardGroupProps,
    GameCardGroupPeekOption,
    GameCardGroupHoverRevealOption,
} from "./GameCardGroup";

interface SectorProps {
    villainName: string;
    hand: GameCardGroupProps;
    villainDeck: GameCardGroupProps;
    villainDiscardPile: GameCardGroupProps;
    fateDeck: GameCardGroupProps;
    fateDiscardPile: GameCardGroupProps;
    villainSideCards: GameCardGroupProps[];
    fateSideCards: GameCardGroupProps[];
}

function Sector({}: SectorProps) {
    return <>Sector</>;
}

export default Sector;
