var express = require('express')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

const hbs = require('hbs')
hbs.registerHelper("priceColor", function (price) {
    if (price > 50) return 'red'
    else return 'green'
})

const { insertNewProduct, getAllProducts, deleteProductById, updateProduct, findProductById } = require('./databaseHandler');

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/new', (req, res) => {
    res.render('add')
})


app.post('/new', async (req, res) => {
    const name = req.body.txtProductName
    const price = req.body.txtProductPrice
    const picUrl = req.body.txtProductPic
    const quantity = req.body.txtProductQuantity
    const newProduct = {
        name: name,
        price: Number.parseFloat(price),
        quantity: Number.parseFloat(quantity),
        picture: picUrl
    }
    if (name.length < 5 || name.length > 20) {
        res.render('add', { name: newProduct, alert: true })
    //     // else if (isNan(Number.parseFloat(price))){
    //     //     res.render('add', {name: newProduct, alert: true})
    //     // }
    }
    // if (picUrl.includes('jpg')) {
    //     res.render('add', {alert: true })
    // }
    
    else{
        await insertNewProduct(newProduct)
        res.redirect('/')
    }
})

app.get('/all', async (req, res) => {
    let results = await getAllProducts()
    res.render('view', { results: results })
})

app.get('/deleteProduct', async (req, res) => {
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/all')
})

app.get('/editProduct', async (req, res) => {
    const id = req.query.id
    const productToEdit = await findProductById(id)
    res.render("edit", { product: productToEdit })
})

app.post('/editProduct', async (req, res) => {
    const id = req.body.id
    const name = req.body.txtProductName
    const price = req.body.txtProductPrice
    const picUrl = req.body.txtProductPic
    const quantity = req.body.txtProductQuantity
    await updateProduct(id, name, price, picUrl, quantity)
    res.redirect('/all')
})

const PORT = process.env.PORT || 8000
app.listen(PORT, (req, res) => {
    console.log("Server is running at PORT: ", PORT)
})