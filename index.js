// creates new object for each comment
class Comment {
    constructor(user, createdAt, content, score, replies) {
        this.user = user
        this.createdAt = createdAt
        this.content = content
        this.score = score
        this.replies = replies
    }
    createComment() {
        const div = document.createElement("div")
        div.classList.add("comment-container")
        const divContent = `
            <div class="comment">
                <div class="comment-info">
                    <img src="${this.user.image.png}" class="profile-picture">
                    <p class="username">${this.user.username}</p>
                    <p class="created-at">${this.createdAt}</p>
                </div>
                <p class="comment-content">${this.content}</p>
                <div class="comment-score">
                    <img class="plus" src="./images/icon-plus.svg">
                    <p id="score">${this.score}</p>
                    <img class="minus" src="./images/icon-minus.svg">
                </div>
                <div class="reply">
                    <img src="./images/icon-reply.svg">
                    <p>Reply</p>
                </div>
            </div>
        `
        div.innerHTML = divContent

        document.querySelector(".comments").append(div)

        this.element = div
    }
    createReply(user, createdAt, content, score) {
        const div = document.createElement("div")
        div.classList.add("reply-box")
        const divContent = `
            <div class="comment-info">
                <img src="${user.image.png}" class="profile-picture">
                <p class="username">${user.username}</p>
                <p class="created-at">${createdAt}</p>
            </div>
            <p class="comment-content">${content}</p>
            <div class="comment-score">
                <img class="plus" src="./images/icon-plus.svg">
                <p id="score">${score}</p>
                <img class="minus" src="./images/icon-minus.svg">
            </div>
            <div class="reply">
                <img src="./images/icon-reply.svg">
                <p>Reply</p>
            </div>
        `
        div.innerHTML = divContent

        this.element.append(div)
    }
}

let comments = []
// load initial comments
async function loadComments() {
    const response = await fetch("./data.json")
    const data = await response.json()

    // create comments
    data.comments.forEach( comment => {
        // get data from json file
        const { user, createdAt, content, score, replies } = comment
        const commentObj = new Comment(user, createdAt, content, score, replies)
        comments.push(commentObj)
        commentObj.createComment()
        commentObj.replies.forEach( reply => {
            commentObj.createReply(reply.user, reply.createdAt, reply.content, reply.score)
        })
    })

    document.querySelector("#create-comment-img").setAttribute("src", data.currentUser.image.png)
}
loadComments()