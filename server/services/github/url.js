export function getRepoDetails(url) {
    let username = url.split('/')[3]
    let repo = (url.split('/')[4]).split('.')[0]
    console.log(repo);
    return { username, repo }
}