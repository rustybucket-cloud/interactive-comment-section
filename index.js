let idCount = 0

// creates new object for each comment
class Comment {
    constructor(commentId, user, createdAt, content, score, replies) {
        this.user = user
        this.createdAt = createdAt
        this.content = content
        this.score = score
        this.replies = replies
        this.commentId = commentId
    }
    createComment() {
        const div = document.createElement("div")
        div.classList.add("comment-container")
        let isCurrentUser = this.user.username === currentUser.username ? true : false
        const divContent = `
            <div class="comment">
                <div class="comment-info">
                    <img src="${this.user.image.png}" class="profile-picture">
                    <p class="username">${this.user.username}</p>
                    <p class="${isCurrentUser ? 'current-user-indicator' : ''}">${isCurrentUser ? "you" : ""}</p>
                    <p class="created-at">${this.createdAt}</p>
                </div>
                <p class="comment-content">${this.content}</p>
                <div class="comment-score">
                    <img class="plus score-change" data-comment-id=${this.commentId} src="./images/icon-plus.svg">
                    <p id="score" data-comment-id=${this.commentId}>${this.score}</p>
                    <img class="minus score-change" data-comment-id=${this.commentId} src="./images/icon-minus.svg">
                </div>
                <div class="reply" data-comment-id=${this.commentId}>
                    <img src="./images/icon-reply.svg">
                    <p>Reply</p>
                </div>
            </div>
        `
        div.innerHTML = divContent

        document.querySelector(".comments").append(div)

        this.element = div
    }
    // adds or subtracts score and updates html
    updateScore(add) {
        if (add) this.score++
        else this.score--
        document.querySelector(`[data-comment-id='${this.commentId}']`).textContent = this.score
    }
}

// reply to be added to comments
class Reply extends Comment {
    constructor(commentId, user, createdAt, content, score, replyTo) {
        super(commentId, user, createdAt, content, score)
        this.replyTo = replyTo
    }
    createReply() {
        const div = document.createElement("div")
        div.classList.add("reply-box")
        let isCurrentUser = this.user.username === currentUser.username ? true : false
        const divContent = `
            <div class="comment-info">
                <img src="${this.user.image.png}" class="profile-picture">
                <p class="username">${this.user.username}</p>
                <p class="${isCurrentUser ? 'current-user-indicator' : ''}">${isCurrentUser ? "you" : ""}</p>
                <p class="created-at">${this.createdAt}</p>
            </div>
            <p class="comment-content">${this.content}</p>
            <div class="comment-score">
                <img class="plus score-change" data-comment-id=${this.commentId} src="./images/icon-plus.svg">
                <p id="score" data-comment-id=${this.commentId}>${this.score}</p>
                <img class="minus score-change" data-comment-id=${this.commentId} src="./images/icon-minus.svg">
            </div>
            <div class="reply">
                <img src="./images/icon-reply.svg">
                <p>Reply</p>
            </div>
        `
        div.innerHTML = divContent

        this.replyTo.append(div)
    }
}

let comments = []
let currentUser
// load initial comments
async function getData() {
    const response = await fetch("./data.json")
    const data = await response.json()

    currentUser = data.currentUser
    data.comments.forEach(comment => {
        const { id, user, createdAt, content, score, replies } = comment
        const commentObj = new Comment(id, user, createdAt, content, score, replies)
        comments.push(commentObj)
    })
    

    loadComments()
}

// loads all comments to DOM
function loadComments() {
    // clears comments
    document.querySelector(".comments").innerHTML = ""

    // create comments
    comments.forEach( comment => {
        idCount += 1
        // get data from json file
        comment.createComment()
        let replies = []
        comment.replies.forEach( reply => {
            const newReply = new Reply(reply.id, reply.user, reply.createdAt, reply.content, reply.score, comment.element)
            replies.push(newReply)
            idCount += 1
        })
        replies.forEach( reply => {
            reply.createReply()
        })
        comment.replies = replies
    })

    document.querySelector("#create-comment-img").setAttribute("src", currentUser.image.png)

    document.querySelectorAll(".score-change").forEach( button => {
        button.addEventListener("click", changeScore)
    })
}
getData()

// add and subtract to score
function changeScore({currentTarget}) {
    const commentId = currentTarget.dataset.commentId
    const add = currentTarget.classList.contains("plus")
    comments.forEach( comment => {
        if (comment.commentId.toString() === commentId) {
            comment.updateScore(add)
        }
        else {
            comment.replies.forEach(reply => {
                if (reply.id === currentTarget.id) {
                    reply.score += add ? 1 : -1
                }
            })
        }
    })
    loadComments()
}

// create a new comment
function createComment() {
    const newCommentText = document.querySelector("#new-comment-text").value
    if (newCommentText !== "") {
        const newComment = new Comment(idCount, currentUser, "just now", newCommentText, 0, [])
        comments.push(newComment)
        newComment.createComment()
    }
}
document.querySelector('#create-comment').addEventListener("click", createComment)