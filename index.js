// creates new object for each comment
class Comment {
    constructor(user, createdAt, content, score, replies, currentUser, commentId) {
        this.user = user
        this.createdAt = createdAt
        this.content = content
        this.score = score
        this.replies = replies
        this.currentUser = currentUser
        this.commentId = commentId
    }
    createComment() {
        const div = document.createElement("div")
        div.classList.add("comment-container")
        const divContent = `
            <div class="comment">
                <div class="comment-info">
                    <img src="${this.user.image.png}" class="profile-picture">
                    <p class="username">${this.user.username}</p>
                    <p class="${this.currentUser ? 'current-user-indicator' : ''}">${this.currentUser ? "you" : ""}</p>
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
            </div>
        `
        div.innerHTML = divContent

        document.querySelector(".comments").append(div)

        this.element = div
    }
    createReply(user, createdAt, content, score, currentUser, commentId) {
        const div = document.createElement("div")
        div.classList.add("reply-box")
        const divContent = `
            <div class="comment-info">
                <img src="${user.image.png}" class="profile-picture">
                <p class="username">${user.username}</p>
                <p class="${currentUser ? 'current-user-indicator' : ''}">${currentUser ? "you" : ""}</p>
                <p class="created-at">${createdAt}</p>
            </div>
            <p class="comment-content">${content}</p>
            <div class="comment-score">
                <img class="plus score-change" data-comment-id=${commentId} src="./images/icon-plus.svg">
                <p id="score" data-comment-id=${commentId}>${score}</p>
                <img class="minus score-change" data-comment-id=${commentId} src="./images/icon-minus.svg">
            </div>
            <div class="reply">
                <img src="./images/icon-reply.svg">
                <p>Reply</p>
            </div>
        `
        div.innerHTML = divContent

        this.element.append(div)
    }
    updateScore(add) {
        console.log(document.querySelector(`[data-comment-id='${this.commentId}']`))
        if (add) this.score++
        else this.score--
        document.querySelector(`[data-comment-id='${this.commentId}']`).textContent = this.score
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
        const { user, createdAt, content, score, replies, id } = comment
        console.log(user)
        const commentObj = new Comment(user, createdAt, content, score, replies, user.username === currentUser.username ? true : false, id)
        comments.push(commentObj)
    })
    

    loadComments()
}

function loadComments() {
    // clears comments
    document.querySelector(".comments").innerHTML = ""

    // create comments
    comments.forEach( comment => {
        // get data from json file
        comment.createComment()
        comment.replies.forEach( reply => {
            comment.createReply(reply.user, reply.createdAt, reply.content, reply.score, reply.user.username === currentUser.username ? true : false, reply.id)
        })
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