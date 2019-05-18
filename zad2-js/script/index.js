document.addEventListener('DOMContentLoaded', function () {

    var url = 'https://www.reddit.com/r/funny.json'
    var structure = { "posts": [], "count": 0 }

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
    // console.log( convertToDataString(new Date(1556749053), 'dd.MM.yyyy HH:mm'), new Date(1556749053 * 1000) )

    function getStructure (json) {
        var newArr = json.data.children

        newArr.forEach(function(el) {
            structure.posts.push({
                "title": el.data.title,
                "upvotes": el.data.ups,
                "downvotes": el.data.downs,
                "score": el.data.score,
                "num_comments": el.data.num_comments,
                "created": convertToDataString(new Date(el.data.created), 'dd.MM.yyyy HH:mm')
            })
        })

         structure.count = newArr.length

         console.log(structure)
        //  console.log(newArr)
     }

    fetch( url )
        .then(function(response) { 
            // console.log( response, response.json() )
            return response.json() 
        })
        .then(function (json) {
            // console.log( json, JSON.stringify(json) )
            // console.log(json.data.children[0].data)
            getStructure(json)
        })
        .catch(function (error) {
            console.log( 'Error', error )
        })



})