// randomFacts.js

const facts = [
    "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
    "Octopuses have three hearts and blue blood.",
    "A group of flamingos is called a 'flamboyance'.",
    "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the metal.",
    "Bananas are berries, but strawberries are not.",
    "There are more stars in the universe than grains of sand on all the Earth's beaches.",
    "A day on Venus is longer than a year on Venus.",
    "Wombat poop is cube-shaped to prevent it from rolling away.",
    "Koalas have fingerprints that are almost identical to human fingerprints.",
    "The shortest war in history lasted just 38 to 45 minutes, fought between Britain and Zanzibar in 1896."
];

export function getRandomFact() {
    const randomIndex = Math.floor(Math.random() * facts.length);
    return facts[randomIndex];
}
