
async function getRandomJoke() {
    try {
        // Fetching a random joke from the joke API
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const jokeData = await response.json();

        // Returning a formatted joke
        return `${jokeData.setup} - ${jokeData.punchline}`;
    } catch (error) {
        return 'Sorry, I couldn\'t fetch a joke at the moment.';
    }
}


export { getRandomJoke };
