const { ObjectId } = require('bson')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://Mint1010:vanh1608@cluster0.c5kutjt.mongodb.net/?retryWrites=true&w=majority'


async function getDB() {
    let client = await MongoClient.connect(url)
    let db = client.db("ATNAssignment")
    return db
}

async function insertNewProduct(newProduct) {
    let db = await getDB()
    let id = await db.collection("products").insertOne(newProduct)
    return id
}

async function getAllProducts() {
    let db = await getDB()
    let results = await db.collection("products").find().toArray()
    return results
}

async function deleteProductById(id) {
    let db = await getDB()
    await db.collection("products").deleteOne({_id: ObjectId(id)})
}

async function findProductById(id) {
    let db = await getDB()
    const productToEdit = await db.collection("products").findOne({_id: ObjectId(id)})
    return productToEdit
}

async function updateProduct(id, name, price, picUrl, quantity) {
    let db = await getDB()
    await db.collection("products").updateOne({ _id: ObjectId(id) },
        { $set: { "name": name, "price": price, "picture": picUrl, "quantity": quantity } })
}

module.exports = {insertNewProduct, getAllProducts, deleteProductById, findProductById, updateProduct}