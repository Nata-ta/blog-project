//menu btn
document.querySelector('.more-button').addEventListener('click', function () {
    document.querySelector('.list-container').classList.toggle('active');
});

// back-to-top btn
var mybutton = document.getElementById("toTopBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
};

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

// create post
let postForm = document.querySelector('.allNews');
let postContainer = document.querySelector('.posts__body');
let loadPostsBtn = postForm.querySelector('._loadPostsBtn');

let posts = [];

class Post {
    constructor(author, body, img, likes, id, date, comments) {
        this.author = author;
        this.body = body;
        this.img = img ? img : '';
        this.likes = likes ? likes : 0;
        this.id = id ? id : new Date().getTime();
        this.date = date ? date : new Date().toLocaleString();
        this.comments = comments;

        this.addLike = this.addLike.bind(this);
        this.render();
    };

    addLike() {
        this.likes++;

        const like = document.querySelector(`[data-id="${this.id}"] .posts__likes`);
        like.innerHTML = this.likes;

        posts.forEach(post => {
            if (post.id === this.id) {
                post.likes = this.likes;
            }
        });

        localStorage.setItem('posts', JSON.stringify(posts));
    };

    renderComments = (element) => {
        let allComments = this.comments;

        if (allComments !== undefined) {
            allComments.forEach(comment => {
                let commentContainer = element.querySelector('.posts__form-body');

                let item = document.createElement('div');
                item.dataset.id = this.id;
                item.classList.add('posts__news');

                item.innerHTML = `
                    <div class="posts__comment-body">
                        <div class="posts__comment-wrap">
                            <h4 class="posts__comment-author">${comment.userName}</h4>
                            <p class="posts__comment-date">${comment.commentDate}</p>
                        </div>
                        <p class="posts__comment-descr">${comment.commentText}</p>
                    </div>
                `;

                commentContainer.appendChild(item);

                return;
            });
        }
    };

    removeElement = (element) => (e) => {
        element.remove();

        posts.splice(posts.indexOf(posts.find(post => post.id === this.id)), 1);

        localStorage.setItem('posts', JSON.stringify(posts));
    };

    render = () => {
        let comments = [];

        if (this.comments !== undefined) {
            this.comments.forEach(comment => {
                comments.push(comment);

                return;
            });
        };

        let element = document.createElement('div');
        element.dataset.id = this.id;
        element.classList.add('posts__news');

        element.innerHTML = `
            <div class="posts__outer">
                <div class="posts__wrap">
                    <h3 class="title posts__title">${this.author}</h3>
                    <p class="posts__date">${this.date}</p>
                </div>
                <span class="posts__remove-btn">
                    <i class="fa fal fa-trash-alt"></i>
                </span>
            </div>
            <div class="posts__img-box"></div>
            <div class="posts__body-info">
                <div class="posts__descr-body">
                    <p class="posts__descr">${this.body}</p>
                    <div class="posts__descr-item">
                        <button class="posts__likes-btn"><span class="posts__likes">${this.likes}</span></button>
                        <button class="posts__comm-btn"><span class="posts__comm">${comments.length}</span></button>
                    </div>
                </div>
            </div>
        `;

        let removeBtn = element.querySelector('.posts__remove-btn');
        removeBtn.addEventListener('click', this.removeElement(element));

        if (this.img) {
            let imgBox = element.querySelector('.posts__img-box');
            imgBox.style.width = '100%';
            imgBox.style.margin = '0 0 30px';

            let image = document.createElement('img');
            image.src = `${this.img}`;
            image.classList.add('posts__img');

            imgBox.appendChild(image);
        };

        let postText = element.querySelector('.posts__descr');

        if (this.body.length >= 500) {
            let spanDots = document.createElement('span');
            let more = document.createElement('span');
            let moreBtn = document.createElement('button');

            postText.innerText = `${this.body.slice(0, 500)}`;

            spanDots.classList.add('dots');
            spanDots.innerText = "...";

            more.classList.add('more');
            more.style.display = "none";
            more.innerHTML = `${this.body.slice(500)}`;

            moreBtn.classList.add('moreBtn');
            moreBtn.innerHTML = "Read more";

            function readAllArticle() {

                if (spanDots.style.display === "none") {
                    spanDots.style.display = "inline";
                    moreBtn.innerHTML = "Read more";
                    more.style.display = "none";
                } else {
                    spanDots.style.display = "none";
                    moreBtn.innerHTML = "Read less";
                    more.style.display = "inline";
                }
            };

            moreBtn.addEventListener('click', readAllArticle);

            postText.appendChild(spanDots);
            postText.appendChild(more);
            postText.appendChild(moreBtn);
        };

        let likeBtn = element.querySelector('.posts__likes-btn');
        likeBtn.addEventListener('click', this.addLike);

        let block = document.createElement('div');
        block.classList.add('posts__comment');

        block.innerHTML = `
            <form class="commentSubmit">
                <h3 class="title posts__comment-title">Comments</h3>
                <div class="posts__form-body"></div>
                <div class="posts__authorForm">
                    <label for="nameAuthor" class="posts__form-author">Author</label>
                    <input type="text" class="posts__form-authorControl" id="nameAuthor" name="authorName">
                </div>
                <div class="posts__comment-textForm">
                    <label for="commentText" class="posts__comment-label">New comment</label>
                    <textarea class="posts__comment-text" id="commentText" rows="3" name="commText"></textarea>
                </div>
                <button class="btn btn-submit posts__comment-btn" type="submit">Send post</button>
            </form>
        `;

        element.appendChild(block);

        let commentBtn = element.querySelector('.posts__comm-btn');
        commentBtn.addEventListener('click', function (e) {
            block.classList.toggle('posts__comment-show');

        });

        if (this.commetns !== null) {
            this.renderComments(element);
        };

        let commentContainer = element.querySelector('.posts__form-body');

        let commentSubmit = element.querySelector('.commentSubmit');

        const onFormCommentSubmit = (e) => {
            e.preventDefault();

            let userName = commentSubmit.authorName.value;
            let commentText = commentSubmit.commText.value;
            let commentDate = new Date().toLocaleString();

            let commentsData = {
                userName,
                commentDate,
                commentText
            };

            comments.push(commentsData);

            let item = document.createElement('div');
            item.dataset.id = this.id;
            item.classList.add('posts__news');

            comments.forEach(comment => {
                item.innerHTML = `
                    <div class="posts__comment-body">
                        <div class="posts__comment-wrap">
                            <h4 class="posts__comment-author">${comment.userName}</h4>
                            <p class="posts__comment-date">${comment.commentDate}</p>
                        </div>
                        <p class="posts__comment-descr">${comment.commentText}</p>
                    </div>
                `;
            });

            commentContainer.appendChild(item);

            let postCommCounter = element.querySelector('.posts__comm');
            postCommCounter.innerHTML = `${comments.length}`;

            posts.forEach(post => {
                if (post.id === this.id) {
                    post.comments = comments;
                };
            });

            localStorage.setItem('posts', JSON.stringify(posts));

            commentSubmit.reset();
        }

        commentSubmit.addEventListener('submit', onFormCommentSubmit);

        postContainer.appendChild(element);
    };
};

const onFormSubmit = (e) => {
    e.preventDefault();

    let newPost = new Post(e.target.author.value, e.target.text.value, e.target.image.value);

    posts.push(newPost);

    let jsonPost = JSON.stringify(posts);

    localStorage.setItem('posts', jsonPost);

    postForm.reset();
}

postForm.addEventListener('submit', onFormSubmit);

const GetSavedPosts = () => {
    let data = localStorage.getItem('posts');

    if (data !== null) {
        posts = JSON.parse(data);
        return posts;
    };

    return null;
};

let postsFromStorage = GetSavedPosts();

if (postsFromStorage !== null) {
    postsFromStorage.forEach(function (post) {
        new Post(post.author, post.body, post.img, post.likes, post.id, post.date, post.comments);
    });
};