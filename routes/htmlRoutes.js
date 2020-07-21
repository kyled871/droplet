const path = require('path')

module.exports = (app) => {

    // index --- homepade ------
    app.get('/', (req,res) => {
        res.sendFile(path.join(__dirname, '../public/HTML/home.html'))
    });

    // view profile page ------
    app.get('/profile/:user?', (req, res) => {
        res.sendFile(path.join(__dirname, "../public/HTML/viewProfile.html"))
    });

}