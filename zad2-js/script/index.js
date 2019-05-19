document.addEventListener('DOMContentLoaded', function () {

    var url = 'https://www.reddit.com/r/funny.json'
    var structure = { "posts": [], "count": 0 }

    var containerPosts = document.querySelector('.container-posts')
    var btnSortByCreate = document.querySelector('#by-create')
    var btnSortByUpVote = document.querySelector('#by-upv')
    var btnSortByDownVote = document.querySelector('#by-downv')
    var btnSortByScore = document.querySelector('#by-score')
    var btnSortByBest = document.querySelector('#by-best')
    var btnSortByLastDay = document.querySelector('#by-last-day')

    function convertToDataString (time, format) {
        var t = new Date(time * 1000)
        var tf = function (i) { return (i < 10 ? '0' : '') + i }

        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (n) {
            switch (n) {
                case 'yyyy':
                    return tf(t.getFullYear())
                    break
                case 'MM':
                    return tf(t.getMonth() + 1)
                    break
                case 'mm':
                    return tf(t.getMinutes())
                    break
                case 'dd':
                    return tf(t.getDate())
                    break
                case 'HH':
                    return tf(t.getHours())
                    break
                case 'ss':
                    return tf(t.getSeconds())
                    break
            }
        })
    }

    function renderPosts (data) {
        containerPosts.innerHTML = ''
        var newPostsList = ''

        data.posts.forEach(function(post) {
            newPostsList += 
            '<div class="post">' +
                '<header class="post__title">'+ post.title +'</header>' +
                '<div>' +
                    '<div class="post__created"><span>Create: </span>'+ post.created +',</div>' +
                    '<div class="post__score"><span>Score: </span>'+ post.score +',</div>' +
                    '<div class="post__comments"><span>Comments: </span>'+ post.num_comments +',</div>' +
                    '<div class="post__upv"><span>Likes: </span>'+ post.upvotes +',</div>' +
                    '<div class="post__downv"><span>Dislikes: </span>'+ post.downvotes +'.</div>' +
                '</div>' +
            '</div>'
        })

        return containerPosts.innerHTML = newPostsList
    }

    function renderTheBestTitle (data) {
        var theBestPost = { 
            title: 'Coś poszło nie tak..',
            upvotes: 0,
            downvotes: 0,
            diff: 0,
            created_n: 0
         }

        data.posts.forEach(function(post) {
            var difference = post.upvotes - post.downvotes

            if ( theBestPost.diff < difference || (theBestPost.diff === difference && theBestPost.created_n <= post.created_n) ) {

                theBestPost = {
                    title: post.title,
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    diff: difference,
                    created_n: post.created_n
                }
            }
        })

        containerPosts.innerHTML = ''
        containerPosts.innerHTML =
            '<div class="post">' +
                '<header class="post__title">'+ theBestPost.title +'</header>' +
            '</div>'

    }

    function renderPostsFromLastDay (data) {

        sortStructure(data, 'created')

        var getTime = new Date().getTime()
        var lastDayTime = getTime - 86400000
        var lastDayPosts = ''
        var increment = 0
        containerPosts.innerHTML = ''

        while ( data.posts[increment].created_n*1000 > lastDayTime ) {
            lastDayPosts +=
                '<div class="post">' +
                    '<header class="post__title">'+ data.posts[increment].title +'</header>' +
                    '<div>' +
                        '<div class="post__created"><span>Create: </span>'+ data.posts[increment].created +',</div>' +
                        '<div class="post__score"><span>Score: </span>'+ data.posts[increment].score +',</div>' +
                        '<div class="post__comments"><span>Comments: </span>'+ data.posts[increment].num_comments +',</div>' +
                        '<div class="post__upv"><span>Likes: </span>'+ data.posts[increment].upvotes +',</div>' +
                        '<div class="post__downv"><span>Dislikes: </span>'+ data.posts[increment].downvotes +'.</div>' +
                    '</div>' +
                '</div>'

                increment++
        }

        console.log(increment)
        containerPosts.innerHTML = lastDayPosts
        increment = 0
    }

    function getStructure (json) {
        var newArr = json.data.children

        newArr.forEach(function(el) {
            structure.posts.push({
                "title": el.data.title,
                "upvotes": el.data.ups,
                "downvotes": el.data.downs,
                "score": el.data.score,
                "num_comments": el.data.num_comments,
                "created": convertToDataString(new Date(el.data.created), 'dd.MM.yyyy HH:mm'),
                "created_n": el.data.created
            })
        })

        structure.count = newArr.length

        renderPosts(structure)
    }

    function sortStructure (structure, sortBy) {

        switch (sortBy) {
            case 'score':
                return structure.posts.sort(function (a, b) {
                    return b.score - a.score
                })
                break
            case 'upvotes':
                return structure.posts.sort(function (a, b) {
                    return b.upvotes - a.upvotes
                })
                break
            case 'downvotes':
                return structure.posts.sort(function (a, b) {
                    return b.downvotes - a.downvotes
                })
                break
            case 'created':
                return structure.posts.sort(function (a, b) {
                    return b.created_n - a.created_n
                })
                break
        }
    }

    fetch( url )
        .then(function(response) { return response.json() })
        .then(function (json) { getStructure(json) })
        .catch(function (error) { console.log( 'Error', error ) })


    /** Events */
    btnSortByCreate.addEventListener('click', function () {
        sortStructure(structure, 'created')
        renderPosts(structure)
    })

    btnSortByUpVote.addEventListener('click', function () {
        sortStructure(structure, 'upvotes')
        renderPosts(structure)
    })

    btnSortByDownVote.addEventListener('click', function () {
        sortStructure(structure, 'downvotes')
        renderPosts(structure)
    })

    btnSortByScore.addEventListener('click', function () {
        sortStructure(structure, 'score')
        renderPosts(structure)
    })

    btnSortByBest.addEventListener('click', function () {
        renderTheBestTitle(structure)
    })

    btnSortByLastDay.addEventListener('click', function () {
        renderPostsFromLastDay(structure)
    })
})