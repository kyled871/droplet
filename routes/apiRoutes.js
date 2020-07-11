module.exports = (app) => {

    //fetches all post from a specific user
    app.get('/api/myposts/:user', (req,res) => {
        res.send('sent')
    })

    //creates a new post in the database
    app.post('/api/post', (req,res) => {
        res.send('sent')
    })

    //updates a specific post
    app.put('/api/post/:id', (req,res) => {
        res.send('sent')
    })

    //updates specific vote
    app.put('/api/vote/:id', (req,res) => {
        res.send('sent')
    })

}