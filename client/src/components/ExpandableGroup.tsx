import { useState } from 'react'

interface Props {
    heading: string
    cards: string[]
}

function ExpandableGroup({ heading, cards }: Props) {
    const [itemsShown, setItemsShown] = useState(0)

    function onClickHandler(_event: React.MouseEvent) {
        setItemsShown(current => current + 1)
    }

    return (
        <>
            <h4>{heading}</h4>
            <button className='btn btn-primary' onClick={onClickHandler}>
                Add
            </button>
            <ul className='list-group'>
                {cards
                    .filter((_, index) => {
                        return index < itemsShown
                    })
                    .map(card => (
                        <li className='list-group-item'>{card}</li>
                    ))}
            </ul>
        </>
    )
}

export default ExpandableGroup
