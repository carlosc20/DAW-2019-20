var axios = require('axios');

function showFicheiro(f, postId){
    if(f.mimetype.match(/image\/.+/) || f.mimetype == 'application/pdf')
        var ficheiro = $('<img src="/ficheiros/' + postId + '/' + f.name + '?mimeType=' + f.mimetype + '" width= "40%" id="modal-img"/>')
    else 
        var ficheiro = $('<p>' + JSON.stringify(f) + '<p>')
    var download = $('<a class="btn btn-dark" href="/download/' + postId + '/' + f.name + '">Download</a>')
    $("#display").empty()
    $('#display').append(ficheiro, download) 
    $('#display').modal()
    $('.close-modal').addClass("btn")
    $('.close-modal').addClass("btn-dark")
}

function showRequests(user){
    let requests = user.requestsRcv

    let table = $('<table class="table table-hover table-danger table-bordered"><tr class="table-header"><th>Tag</th><th>Requester</th> <th></th><th></th></tr></table>')
    for(let i = 0; i < requests.length; i++){
        let args = {
            user: user,
            tag: requests[i].tag 
        }
        let row = $('<tr><td>' + requests[i].tag + '</td><td>' 
        + requests[i].requester + '</td> <td><button class="fas fa-check-square" onclick=accept(' + args + ')></i> </td> <td><i class="fas fa-times onclick=decline(' + args +')"></i></td></tr>')
        table.append(row)
    }
    
    $("#display").empty()
    $('#display').append(table) 
    $('#display').modal()
    $('.close-modal').addClass("btn")
    $('.close-modal').addClass("btn-dark")
}

$(function(){
    var cont = 1

    $("#tagbutton").click(e => {
        e.preventDefault()
        let tag = $("#tagselector option:selected").text()
        cont++
        var linha = $('<tr></tr>', {id: 'tag' + cont})
        var tagInput = $('<input type="text" name="tags">', {id: 'dtag' + cont})

        var n = "#tag" + cont
        var button = $('<button/>',
        {
            text: 'X',
            class: "btn-danger",
            click: function () { 
                $(n).remove();
            }
        });
    

        tagInput.val(tag)
        $("#taglist").append(linha)
        $("#tag" + cont).append(tagInput).append(button)
    })
})