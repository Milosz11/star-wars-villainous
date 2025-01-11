const moffGideon = require("./moff-gideon");
const moffGideonVillainCards = require("./moff-gideon-villain-cards");
const moffGideonFateCards = require("./moff-gideon-fate-cards");
const generalGrievous = require("./general-grievous");
const generalGrievousVillainCards = require("./general-grievous-villain-cards");
const generalGrievousFateCards = require("./general-grievous-fate-cards");

const villainDefinitions = {
    "Moff Gideon": moffGideon,
    "General Grievous": generalGrievous,
};

const cardDefinitions = {
    "Moff Gideon": Object.assign({}, moffGideonVillainCards, moffGideonFateCards),
    "General Grievous": Object.assign({}, generalGrievousVillainCards, generalGrievousFateCards),
};

function getVillainDefinition(villainName) {
    return villainDefinitions[villainName];
}

function getCardDefinition(villainName, cardName) {
    return cardDefinitions[villainName][cardName];
}

module.exports = { getVillainDefinition, getCardDefinition };
