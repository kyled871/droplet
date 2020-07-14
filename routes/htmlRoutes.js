const path = require('path')

module.exports = (app) => {
    app.get('/', (req,res) => {
        res.sendFile(path.join(__dirname, '../public/HTML/home.html'))
    });


    app.get('/profile', (req, res) => {
        res.sendFile(path.join(__dirname, "../public/HTML/viewProfile.html"))
    });
    

    
}