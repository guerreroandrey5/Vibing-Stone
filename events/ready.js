module.exports = (client) => {
    console.log(`${client.getTime()} :: Logged in as ${client.user.tag}!`);
    client.user.setActivity(`[/help | Vibing The Stones]`, {type: "PLAYING"})
    setInterval(() => {
        client.user.setActivity(`[/help | Vibing The Stones]`, {type: "PLAYING"})
    }, 600_00)
}