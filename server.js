import app from './app.js'

app.set('port', process.env.PORT)
const server = app.listen(app.get('port'), () => {
    console.log(`Express running at PORT ${server.address().port} **`)
})