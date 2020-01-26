var PDFImage = require("pdf-image").PDFImage;

let pdfImage = new PDFImage('public\\ficheiros\\77fef8e5\\e38793e0\\948b62a3\\7479b\\06-async.pdf',{
    graphicsMagick: true,
  })
console.dir(pdfImage)
pdfImage.convertPage(0)
    .then((imagePath) => {
        console.log("image path :" +imagePath)
    })
    .catch(err => console.log(err))