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