export interface GameCardProps {
    villainName: string;
    cardName: string;
    cardBackImagePath: string;
    cardFrontImagePath: string;
}

function GameCard({ villainName, cardName, cardBackImagePath, cardFrontImagePath }: GameCardProps) {
    return (
        <>
            {villainName}
            {cardName}
            {cardBackImagePath}
            {cardFrontImagePath}
        </>
    );
}

export default GameCard;
