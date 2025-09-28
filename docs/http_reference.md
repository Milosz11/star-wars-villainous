# API Documentation

## `GET /game/game-settings`

Returns currently available game settings.

### Returns

Upon success, returns the following body with a `200` status code:

```json
{
    "availableVillains": [ "<string>" ], // villains currently supported
    "maxNumPlayers": <int> // maximum number of players supported in one game
}
```

Upon failure, may return status codes: `500`.

## `POST /game/new-game`

Creates a new game with the passed Villains and returns the starting board state.

Expected request payload format:

```json
{
    "players": [
       "<villainNameForPlayer1>",
       "<villainNameForPlayer2>"
    ],
    "seed": "<string>" // should be 8 characters or more
}
```

### Returns

Upon success (status code `200`), returns the following payload with `status` set to `"success"`. Upon failure (status code `4xx or 5xx`), returns with `status` set to `"error"`.

```json
{
    status: "success" | "error",

    // only set if 'status' is "success"
    gameId: "<string>",
    gameBoard: <gameBoard>,

    // only set if 'status' is "error"
    errorMessage: "<string>"
}
```

## Result Formats

### `gameBoard`

```json
{
    "seed": "<string>",
    "counter": <int>,
    "player-id-in-turn": "<playerIdString>",
    "sectors": <sectors>
}
```

### `sectors`

```json
{
    "<playerIdString>": {
        "player-id": "<playerIdString>",
        "villain-name": "<string>",
        "objective": "<string>",
        "previous-villain-mover-location": "<string>",
        "villain-mover-location": "<string>",
        "ambition": <int>,
        "credits": <int>,
        "locations": [ <location> ],
        "hand": [ <card> ],
        "villain-deck": [ <card> ],
        "villain-discard-pile": [ <card> ],
        "fate-deck": [ <card> ],
        "fate-discard-pile": [ <card> ],
    },
    ...
}
```

### `location`

```json
{
    "name": "<string>",
    "actions": [ "<actionNameString>" ],
    "taken-actions": [ "<actionNameString>" ],
    "hero-side-cards": [ <card> ],
    "villain-side-cards": [ <card> ]
}
```

### `card`

```json
{
    // mandatory fields
    "name": "<string>",
    "card-type": "<string>",
    "card-id": "<cardIdString>",

    // the rest are optional fields depending on the card type and the card itself
    "description": "<string>",
    "credit-cost": <int>,
    "ambition-cost": <int>,
    "strength": <int>,
    "additional-strength": <int>,
    "actions": [ "<actionNameString>" ],
    "attached-cards": [ <card> ]
}
```
