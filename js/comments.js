class CommentSystem {
    constructor() {
        this.currentPage = 1;
        this.commentsPerPage = 5;
        this.commentsCache = {};
        this.reservedUsername = atob("bGFpbg==");
        this.elements = {
            container: null,
            navigation: null,
            commentsList: null,
            form: null,
            usernameInput: null,
            passwordInput: null,
            commentInput: null
        };
    }

    initialize() {
        this.createElements();
        this.attachEventListeners();
    }

    createElements() {
        this.elements.container = document.createElement('div');
        this.elements.container.classList.add('comments-container');
        this.elements.container.style.opacity = '0';
        this.elements.container.style.transition = 'opacity 0.5s ease-in-out';

        const controlsSection = document.createElement('div');
        controlsSection.classList.add('controls-section');

        this.elements.form = document.createElement('form');
        this.elements.form.classList.add('comment-form');

        this.elements.form.innerHTML = `
            <input autocomplete="false" type="text" class="username-input" placeholder="enter your username..." required />
            <input autocomplete="false" type="password" class="password-input" placeholder="enter your password..." style="display: none;" />
            <textarea class="comment-input" placeholder="enter your message..." required></textarea>
        `;

        this.elements.navigation = document.createElement('div');
        this.elements.navigation.classList.add('comments-navigation');
        this.elements.navigation.innerHTML = `
            <button type="button" class="nav-button prev-button">←</button>
            <button type="submit" class="submit-button">send</button>
            <button type="button" class="nav-button next-button">→</button>
        `;

        this.elements.commentsList = document.createElement('div');
        this.elements.commentsList.classList.add('comments-list');

        const spinner = document.createElement('div');
        spinner.classList.add('loading-spinner');

        const commentsListInner = document.createElement('div');
        commentsListInner.classList.add('comments-list-inner');
        this.elements.commentsList.appendChild(commentsListInner);
        this.elements.commentsList.appendChild(spinner);

        controlsSection.appendChild(this.elements.form);
        controlsSection.appendChild(this.elements.navigation);

        this.elements.container.appendChild(controlsSection);
        this.elements.container.appendChild(this.elements.commentsList);

        document.body.appendChild(this.elements.container);

        this.elements.usernameInput = this.elements.form.querySelector('.username-input');
        this.elements.passwordInput = this.elements.form.querySelector('.password-input');
        this.elements.commentInput = this.elements.form.querySelector('.comment-input');
        
        this.elements.usernameInput.addEventListener('input', () => {
            this.togglePasswordField();
        });
    }

    togglePasswordField() {
        const enteredUsername = this.elements.usernameInput.value.trim().toLowerCase();
        if (enteredUsername === this.reservedUsername) {
            this.elements.passwordInput.style.display = 'block';
        } else {
            this.elements.passwordInput.style.display = 'none';
        }
    }

    async postComment(username, content, password) {
        try {
            const payload = { content, username };

            if (username.toLowerCase() === this.reservedUsername) {
                if (password) {
                    payload.password = password;
                }
            }
    
            const response = await fetch('https://api.lain.ovh/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "an error occurred!");
                return false;
            }
    
            return true;
        } catch (error) {
            console.error('error posting comment:', error);
            return false;
        }
    }

    attachEventListeners() {
        const prevButton = this.elements.navigation.querySelector('.prev-button');
        const nextButton = this.elements.navigation.querySelector('.next-button');

        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadComments();
            }
        });

        nextButton.addEventListener('click', () => {
            this.currentPage++;
            this.loadComments();
        });

        this.elements.navigation.querySelector('.submit-button').addEventListener('click', async (e) => {
            e.preventDefault();
            const username = this.elements.usernameInput.value.trim();
            const content = this.elements.commentInput.value.trim();
            const password = this.elements.passwordInput.value.trim();

            if (username && content) {
                const success = await this.postComment(username, content, password);
                if (success) {
                    this.elements.usernameInput.value = '';
                    this.elements.commentInput.value = '';
                    this.elements.passwordInput.value = '';

                    this.commentsCache = {};
                    this.loadComments();
                }
            } else {
                alert('both username and comment are required!');
            }
        });
    }

    async fetchComments(page) {
        if (this.commentsCache[page]) {
            return this.commentsCache[page];
        }

        try {
            const response = await fetch(`https://api.lain.ovh/comments?page=${page}&limit=${this.commentsPerPage}`);
            if (!response.ok) throw new Error(`error fetching comments: ${response.statusText}`);

            const data = await response.json();
            this.commentsCache[page] = data;
            return data;
        } catch (error) {
            console.error('error fetching comments:', error);
            return { comments: [], totalPages: 0 };
        }
    }
    
    renderComments(comments) {
        const commentsListInner = this.elements.commentsList.querySelector('.comments-list-inner');
        commentsListInner.innerHTML = '';
        
        for (let i = comments.length - 1; i >= 0; i--) {
            const comment = comments[i];
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            
            const usernameClass = comment.username.toLowerCase() === this.reservedUsername ? 'reserved-user' : '';
        
            commentElement.innerHTML = `
                <div class="comment-content">${comment.content}</div>
                <div class="comment-user ${usernameClass}">- ${comment.username}</div>
                <div class="comment-date">${new Date(comment.timestamp).toLocaleString()}</div>
            `;
        
            commentsListInner.prepend(commentElement);
        }
    }
    

    async loadComments() {
        const spinner = this.elements.commentsList.querySelector('.loading-spinner');
        spinner.style.display = 'block';

        try {
            const { comments, totalPages } = await this.fetchComments(this.currentPage);
            this.renderComments(comments);

            const prevButton = this.elements.navigation.querySelector('.prev-button');
            const nextButton = this.elements.navigation.querySelector('.next-button');

            prevButton.disabled = this.currentPage === 1;
            nextButton.disabled = this.currentPage >= totalPages;
        } finally {
            spinner.style.display = 'none';
        }
    }

    show() {
        this.elements.container.style.opacity = '1';
        this.loadComments();
    }
}

window.commentSystem = new CommentSystem();
