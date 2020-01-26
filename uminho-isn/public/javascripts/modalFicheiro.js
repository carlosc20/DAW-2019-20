function showFicheiro(f, postId){
    console.log("HELLO")
    var div = $('<div id="modal-container" class="w3-card-4"></div>')
    if(f.mimetype.match(/image\/.+/))
        var ficheiro = $('<img src="/ficheiros/' + postId + '/' + f.name + '" width= "40%" id="modal-img"/>')
    else 
        var ficheiro = $('<p>' + JSON.stringify(f) + '<p>')
    var download = $('<div><a href="/download/' + f.name + '">Download</a></div>')
    div.append(ficheiro, download)
    $("#display").empty()
    $('#display').append(div) 
    $('#display').modal()
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