var Koa = require('koa')
var app = new Koa()
const bodyParser = require('koa-body')
const mongoose = require('mongoose')

const requests = require('./routes/requests')

app.use(bodyParser())
app.use(requests.routes())



async function start() {
  try {
    await mongoose.connect(
      'mongodb://localhost/testdb',
      { useNewUrlParser: true }
    )
    app.listen(5000, () => {
      console.log('Server running at port 5000')
    })
  } catch(e) {
    console.log(e)
  }
}

start()


