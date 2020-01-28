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

    $("#mais1").click(e => {
        e.preventDefault()
        cont++
        var campo = $('<div></div>', {class: 'w3-container', id: 'f' + cont})

        var desc = $('<div></div>', {class: 'w3-cell-row', id: 'desc'+ cont})
        var descLabel = $('<label class="w3-cell">Descrição:</label>')
        var descInput = $('<input/>', {class: 'w3-input w3-cell', type: "text", name: "desc"})
        
        var ficheiro = $('<div></div>', {class: 'w3-cell-row', id: 'ficheiro' + cont})
        var ficheiroLabel = $('<label class="w3-cell">Ficheiro:</label>')
        var ficheiroInput = $('<input/>', {class: 'w3-input w3-cell', type: "file", name: "ficheiro"})

        $("#lista").append(campo)
        
        $("#f"+cont).append(desc)
        $("#desc"+cont).append(descLabel, descInput)

        $("#f"+cont).append(ficheiro)
        $('#ficheiro'+cont).append(ficheiroLabel, ficheiroInput) 
    })
})