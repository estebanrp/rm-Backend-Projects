async function gitActivity(user) {
    const res = await fetch(`https://api.github.com/users/${username}/events`)
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("user not found")
        } else {
            throw new Error("error")
        }
    }

    return res.json()
}

function displayActivity(events) {
    if (events.length === 0) {
        console.log("No recent activity found.");
        return;
    }

    events.forEach((event) => {
        let action;
        switch (event.type) {
            case "PushEvent":
                const commitCount = event.payload.commits.length;
                action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
                break;
            case "IssuesEvent":
                action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
                break;
            case "WatchEvent":
                action = `Starred ${event.repo.name}`;
                break;
            case "ForkEvent":
                action = `Forked ${event.repo.name}`;
                break;
            case "CreateEvent":
                action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                break;
            default:
                action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
                break;
        }
        console.log(`- ${action}`);
    });
}

const username = process.argv[2];
if (!username) {
    console.error("Please provide a GitHub username.");
    process.exit(1);
}

gitActivity(username)
    .then((events) => {
        displayActivity(events);
    })
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });


