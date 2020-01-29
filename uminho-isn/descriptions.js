const bcrypt = require('bcryptjs');

const descriptions = [
    "Buffalo turkey flank spare ribs pork chop.",
    "Corned beef hamburger buffalo shankle salami.",
    "Pork ground round rump t-bone, corned beef tri-tip turducken strip steak.",
    "Pig filet mignon pork belly pork chop.",
    "Drumstick prosciutto meatball pig doner, ball tip frankfurter short ribs.",
    "Frankfurter pork chop shankle tongue porchetta pork belly pork.",
    "Tenderloin pork chop prosciutto pork t-bone brisket flank ham.",
    "Bresaola rump bacon beef ribs hamburger andouille ground round spare ribs.",
    "Tri-tip pastrami cupim tail alcatra flank.",
    "Frankfurter strip steak tenderloin hamburger boudin chislic t-bone sausage pancetta landjaeger jowl pork chop ball tip sirloin.","Buffalo ham leberkas kielbasa, pork landjaeger meatball short ribs shankle.",
    "Salami short ribs corned beef spare ribs burgdoggen.",
    "Tri-tip jerky t-bone tongue ground round ribeye porchetta biltong turkey chicken prosciutto venison.",
    "Rump picanha tenderloin t-bone corned beef sausage.",
    "Ham bacon drumstick chuck frankfurter kielbasa picanha shankle.",
    "Alcatra corned beef hamburger, porchetta shoulder turkey sausage tail biltong chicken picanha spare ribs.",
    "Jerky swine biltong, salami venison pork belly bresaola short ribs prosciutto brisket t-bone picanha chislic shankle alcatra.",
    "Buffalo jerky pork chop, pork corned beef turkey bresaola shank prosciutto kielbasa jowl swine.",
    "Cupim bresaola rump boudin pig venison burgdoggen tenderloin.",
    "Meatloaf chuck pig, pork chop ball tip tenderloin rump sausage spare ribs.",
    "Salami short loin rump kielbasa.",
    "Sirloin ham chislic shankle cupim bresaola strip steak tenderloin drumstick ball tip frankfurter pork belly bacon.",
    "Strip steak meatball rump picanha corned beef salami ribeye filet mignon venison ground round kevin beef ribs t-bone.",
    "Meatloaf leberkas venison shank filet mignon chicken, jowl pastrami boudin landjaeger burgdoggen prosciutto flank.",
    "Tri-tip beef ribs burgdoggen boudin shankle, ham kevin pork belly pork loin swine turducken hamburger landjaeger filet mignon tongue.",
    "Spare ribs pork belly pastrami strip steak jerky boudin tenderloin chislic filet mignon drumstick t-bone capicola salami tail.",
    "Pig short loin tri-tip ball tip meatball tongue.",
    "Corned beef spare ribs tongue prosciutto.",
    "Andouille chicken filet mignon shank, spare ribs ham hock picanha hamburger.",
    "Tail salami t-bone kevin ground round biltong hamburger brisket porchetta spare ribs shankle doner alcatra turducken.",
    "Frankfurter leberkas pork chop turkey ball tip hamburger strip steak.",
    "Biltong pork chop pork loin, fatback capicola tri-tip ground round swine flank doner burgdoggen tenderloin.",
    "Porchetta chislic bacon, prosciutto pastrami turkey swine shoulder rump drumstick.",
    "Venison capicola corned beef spare ribs frankfurter beef ribs salami kielbasa.",
    "Porchetta pork chop filet mignon salami drumstick, bacon hamburger ham hock tenderloin leberkas boudin burgdoggen andouille.",
    "Ribeye pancetta turducken chuck, doner pork loin chislic boudin andouille pastrami landjaeger short loin tri-tip turkey ball tip.",
    "Rump burgdoggen ham spare ribs meatball picanha.",
    "Chislic shankle alcatra shank andouille corned beef pastrami landjaeger, shoulder meatloaf swine.",
    "Pastrami strip steak kielbasa, burgdoggen pork tail boudin short loin pancetta sirloin flank hamburger doner.",
    "Pork pastrami ham, leberkas porchetta turducken ribeye tenderloin sausage.",
    "Chuck landjaeger turducken, shoulder venison sirloin ribeye capicola sausage.",
    "Drumstick salami leberkas chuck tail spare ribs landjaeger.",
    "Pastrami tenderloin chuck, t-bone pork belly drumstick corned beef jowl cupim hamburger doner sirloin.",
    "Biltong boudin landjaeger, t-bone corned beef pork chop cow ham ribeye ball tip bacon jerky.",
    "Frankfurter ham pig salami meatloaf andouille pork chop tenderloin.",
    "Flank kevin chislic sausage boudin pork loin capicola andouille rump hamburger ham pork chop filet mignon strip steak.",
    "Chuck pork belly frankfurter boudin tongue doner.",
    "Landjaeger chislic ham hock tri-tip tail brisket picanha pastrami pancetta porchetta short ribs ball tip.",
    "Shank meatloaf pork loin biltong filet mignon cupim pork belly beef ribs doner tongue meatball.",
    "Fatback shoulder tri-tip cupim, buffalo rump jerky sausage tail pork belly t-bone chuck kevin.",
    "Meatball picanha porchetta meatloaf buffalo shoulder chuck swine burgdoggen rump.",
    "Ribeye alcatra chuck, corned beef hamburger fatback shankle jowl swine frankfurter sausage turducken chicken.",
    "Ham hock kevin corned beef, turkey shankle hamburger rump.",
    "Bacon tenderloin pastrami jerky kielbasa turkey, pancetta cow pork belly ribeye alcatra.",
    "Tail meatball doner chicken rump bresaola pig cupim flank alcatra salami short loin shankle pork loin.",
    "Frankfurter ground round jowl, pig flank pastrami tongue.",
    "Strip steak ham hock frankfurter shoulder pork cupim chuck beef.",
    "Capicola ribeye alcatra pig kielbasa tongue.",
    "Doner swine pastrami, pig prosciutto capicola turkey ham hock beef ribs tri-tip pork chop chicken shank rump.",
    "Ball tip ham hock swine landjaeger strip steak.",
    "Chuck shoulder short ribs cupim, turducken pork chop cow.",
    "Bacon shoulder tri-tip, chicken ground round swine short loin doner.",
    "Pastrami meatball venison, pancetta tri-tip jowl andouille meatloaf bacon bresaola strip steak t-bone hamburger.",
    "Ham hock hamburger brisket pig.",
    "Bresaola cow meatball corned beef alcatra turkey sausage chislic biltong shoulder jowl flank venison burgdoggen.",
    "Shankle bacon filet mignon shoulder tri-tip.",
    "Ribeye tri-tip ground round, short loin buffalo flank kielbasa leberkas porchetta pork alcatra.",
    "Pancetta prosciutto short ribs ball tip chicken, brisket bacon picanha sirloin jerky sausage meatloaf ham flank.",
    "Shoulder hamburger turducken, cow chuck sirloin bresaola.",
    "Capicola filet mignon ground round tri-tip chicken flank pork belly burgdoggen alcatra.",
    "Chuck ribeye venison bacon chicken, pancetta short ribs frankfurter pork belly corned beef landjaeger tenderloin pig ham hock tongue.",
    "Pork belly ribeye beef, t-bone salami jowl beef ribs tenderloin cupim spare ribs.",
    "Bacon fatback frankfurter, landjaeger jerky sirloin doner cupim shankle leberkas pork loin brisket corned beef flank sausage.",
    "Chislic ground round tail ball tip, t-bone tenderloin tri-tip picanha tongue sirloin leberkas.",
    "Biltong shoulder andouille, jowl t-bone swine sirloin.",
    "Sirloin ball tip ham hock, turducken strip steak pancetta meatball cow landjaeger sausage tail shank bresaola alcatra.",
    "Flank biltong tri-tip, alcatra pastrami fatback sausage.",
    "Short loin corned beef alcatra, pastrami drumstick buffalo ground round andouille picanha tri-tip.",
    "Shank leberkas flank frankfurter.",
    "Shank picanha jowl, chuck chicken rump bresaola buffalo landjaeger capicola corned beef doner ribeye.",
    "Cow venison chislic, swine alcatra brisket pastrami turkey chuck fatback jowl jerky salami.",
    "Jerky meatloaf picanha fatback jowl spare ribs, buffalo sirloin strip steak beef tenderloin tri-tip frankfurter cow.",
    "Drumstick ribeye chicken shankle, meatball short loin swine.",
    "Shankle pork tongue burgdoggen, pancetta pork chop pig.",
    "Tenderloin filet mignon swine boudin.",
    "Frankfurter venison jerky, filet mignon sausage doner hamburger tenderloin pastrami fatback capicola salami turducken brisket pork.",
    "Burgdoggen shankle pork belly ground round andouille, drumstick hamburger pork fatback flank doner ham kevin salami.",
    "Ground round ribeye venison jowl bacon pig pork.",
    "Chicken ribeye cupim ball tip andouille salami short loin tail beef pancetta porchetta corned beef beef ribs strip steak bacon.","Filet mignon doner kielbasa pastrami rump ground round cow drumstick flank turducken.",
    "Pastrami jowl pork chop shankle t-bone brisket sausage frankfurter shoulder, meatloaf boudin pork belly tail.",
    "Cupim drumstick sirloin shankle, rump frankfurter tri-tip.",
    "Filet mignon cow tongue chislic shoulder burgdoggen chicken beef ribs jowl pastrami.",
    "Doner kielbasa cupim shank andouille.",
    "Tenderloin shankle pork loin andouille alcatra ham rump pork belly prosciutto.",
    "Frankfurter turkey landjaeger ham hock buffalo ribeye pork beef corned beef pastrami.",
    "Kevin corned beef jowl short ribs ham hock boudin t-bone shankle porchetta cupim landjaeger.",
    "Tenderloin bacon pork capicola, corned beef t-bone shoulder meatball shankle boudin andouille jowl sausage.",
    "Cupim shankle landjaeger corned beef ribeye filet mignon boudin beef chuck picanha tenderloin pork.",
    "Cupim pastrami beef ribs jowl brisket strip steak tongue salami."
]

const names = [
  "Abigail Francia",
  "Abigail Malta",
  "Abraao Ourique",
  "Adelina Dourado",
  "Adriana Camello",
  "Aderito Curvelo",
  "Aida Canedo"]


var numName = 0
module.exports = {
    getRandomDescription : function () {
        return descriptions[Math.floor(Math.random()*descriptions.length)] 
    },

    getUsers : function () {
        return generatedUsers
    }
}

getRandomEmail = (username) => {
    let name = username.replace(' ', '').toLowerCase()
    let rand = Math.random()
    if(rand < 0.4){
        return name + '@gmail.com'
    }
    if(rand < 0.7){
        return name + '@hotmail.com'
    }
    if(rand < 0.8){
        return name + '@sapo.pt'
    }
    else {
        return name + '@yahoo.com'
    }
}


var generatedUsers = names.map(user => {
    console.log(numName + " generating user " + user )
    numName++
    return {
        name : user,
        email: getRandomEmail(user),
        type: 'local',
        password : bcrypt.hashSync('123', 10)
    }
})
