import { useState } from 'react'

import './App.css'
import ExpandableGroup from './components/ExpandableGroup'

function App() {
    const heading = 'Droid army'
    const cards = [
        'B-X Commando Droids',
        'Magna Guards',
        'B-2 Super Battle Droids',
        'B-1 Battle Droids',
        'Droidekas',
    ]

    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <h1>Hello there General Kenobi</h1>
            </div>
            <div>
                <h4>count is {count}</h4>
                <button className='btn btn-primary' onClick={() => setCount(count => count + 1)}>
                    Primary Button
                </button>
            </div>
            <ExpandableGroup heading={heading} cards={cards} />
        </>
    )
}

export default App
