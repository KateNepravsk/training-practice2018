"use strict";

var moduleDOM = (function () {
    let user = "nepravskayak_";

    const posts = document.querySelector('div[class="lenta"]');
    const postTemplate = document.getElementById('postTemplate');
    const editButtonsTemplate = document.getElementById('editButtonsTemplate');
    const headerTemplate = document.getElementById('headerTemplate');

    return {
        addPhotoPostToHtml: function (photoPost, show) {
            if (document.getElementById(photoPost.id) != null)
                return;

            let post = document.importNode(postTemplate.content, true);
			
			post.querySelector('div[class="publication"]').id = photoPost.id;
			post.getElementById('user').textContent = photoPost.author;
			let options = {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            };
            post.getElementById('date').textContent = photoPost.createdAt.toLocaleTimeString("en-us", options);
			post.getElementById('photo').src = photoPost.photoLink;
            post.getElementById('description').textContent = photoPost.description;
            post.getElementById('hashtags').textContent = photoPost.hashtags;

            let editButtons = post.querySelector('div[id="user_button"]');
            if (user === photoPost.author)
                editButtons.insertBefore(document.importNode(editButtonsTemplate.content, true), editButtons.lastChild);
            if (photoPost.likes && photoPost.likes.includes(user))
                editButtons.querySelector('input[class="win"]').src = "win.png";

            if (show)
                posts.insertBefore(post, posts.lastChild);
            else
                posts.insertBefore(post, posts.firstChild);
        },

        showPosts: function () {
            let displayedPosts = module.getPhotoPosts(0, 5);
            displayedPosts.forEach(photoPost => this.addPhotoPostToHtml(photoPost, 1));
        },

        addPhotoPost: function (photoPost) {
            if (module.addPhotoPost(photoPost))
                this.addPhotoPostToHtml(photoPost, 0);
        },

        removePhotoPost: function (id) {
            module.removePhotoPost(id);
            let post = document.getElementById(id);
            if (post != null)
                posts.removeChild(post);
        },

        editPhotoPost: function (id, photoPost) {
            if (!module.editPhotoPost(id, photoPost))
                return;
            let post = document.getElementById(id);
            if (post != null) {
                if (photoPost.description !== undefined)
                    post.querySelector('p[id="description"]').textContent = photoPost.description;
                if (photoPost.photoLink !== undefined)
                    post.querySelector('img[id="photo"]').src = photoPost.photoLink;
                if (photoPost.hashtags !== undefined)
                    post.querySelector('p[id="hashtags"]').textContent = photoPost.hashtags;
            }
        },

        changeHeader: function () {
            if (user !== null) {
                let headerButtons = document.querySelector('header[id="header"]');
                headerButtons.insertBefore(document.importNode(headerTemplate.content, true),
                    headerButtons.querySelector('div[id="exit"]'));
                headerButtons.querySelector("h3").textContent = user;
            }
        },

        addAuthors: function () {
            let authorsList = module.getAuthors();
            let dl = document.createElement('datalist');
            document.querySelector('p[id="list"]').replaceChild(dl, document.querySelector('datalist[id="authors"]'));
            document.querySelector('datalist').id = "authors";
            authorsList.forEach(author => {
                let elem = document.createElement('option');
                elem.value = author;
                (document.querySelector('datalist[id="authors"]')).appendChild(elem);
            })
        }
    }
})();

//1)
moduleDOM.showPosts();
//2)
const niceToAdd = {
    id: "22",
    description: "Do u like this story?",
    createdAt: new Date('2018-02-26T11:42:43'),
    author: "nepravskayak_",
    hashtags: ['harrypotter', 'potterhead', 'photo'],
    likes: [],
    photoLink: 'http://saintlouis.kidsoutandabout.com/sites/default/files/1718_HarryPotter3_large.jpg'
};
moduleDOM.addPhotoPost(niceToAdd);
//3)
moduleDOM.removePhotoPost('3');
//4)
const permittedChanges = {
        description: "Don't apologize for feeling something or a lot.",
        photoLink: "http://garypeppergirl.com/wp-content/uploads/2015/06/Kauai-luke_shadbolt-travel-nicole_warne-1-950x634.jpg",
};
moduleDOM.editPhotoPost(2, permittedChanges)
//5)
moduleDOM.changeHeader();
//6)
moduleDOM.addAuthors();