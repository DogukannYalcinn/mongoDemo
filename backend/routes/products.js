const Router = require("express").Router;
const Mongodb = require("mongodb");
const db = require("../database");
const Decimal128 = Mongodb.Decimal128;
const ObjectId = Mongodb.ObjectId;

const router = Router();

// const productsDummy = [
//     {
//         _id: 'fasdlk1j',
//         name: 'Stylish Backpack',
//         description:
//             'A stylish backpack for the modern women or men. It easily fits all your stuff.',
//         price: 79.99,
//         image: 'http://localhost:3100/images/product-backpack.jpg'
//     },
//     {
//         _id: 'asdgfs1',
//         name: 'Lovely Earrings',
//         description:
//             "How could a man resist these lovely earrings? Right - he couldn't.",
//         price: 129.59,
//         image: 'http://localhost:3100/images/product-earrings.jpg'
//     },
//     {
//         _id: 'askjll13',
//         name: 'Working MacBook',
//         description:
//             'Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!',
//         price: 1799,
//         image: 'http://localhost:3100/images/product-macbook.jpg'
//     },
//     {
//         _id: 'sfhjk1lj21',
//         name: 'Red Purse',
//         description: 'A red purse. What is special about? It is red!',
//         price: 159.89,
//         image: 'http://localhost:3100/images/product-purse.jpg'
//     },
//     {
//         _id: 'lkljlkk11',
//         name: 'A T-Shirt',
//         description:
//             'Never be naked again! This T-Shirt can soon be yours. If you find that buy button.',
//         price: 39.99,
//         image: 'http://localhost:3100/images/product-shirt.jpg'
//     },
//     {
//         _id: 'sajlfjal11',
//         name: 'Cheap Watch',
//         description: 'It actually is not cheap. But a watch!',
//         price: 299.99,
//         image: 'http://localhost:3100/images/product-watch.jpg'
//     }
// ];

// Get list of products products
router.get("/", (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;
  const pageSize = 2;
  // let resultProducts = [...products];
  // if (queryPage) {
  //     resultProducts = products.slice(
  //         (queryPage - 1) * pageSize,
  //         queryPage * pageSize
  //     );
  // }
  // console.log(queryPage);
  // console.log((queryPage - 1) * pageSize);

  const products = [];
  db.getDb()
    .db()
    .collection("products")
    .find({})
    // .sort({ price: -1 })
    // .skip((queryPage - 1) * pageSize)
    .limit(pageSize)
    .forEach((productDocs) => {
      productDocs.price = productDocs.price.toString();
      products.push(productDocs);
    })
    .then((results) => {
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get single product
router.get("/:id", (req, res, next) => {
  // const product = products.find(p => p._id === req.params.id);
  db.getDb()
    .db()
    .collection("products")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      result.price = result.price.toString();
      console.log(result);
      res.json(result);
    })
    .catch((err) => console.log(err));
});

// Add new product
// Requires logged in user
router.post("", (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  db.getDb()
    .db()
    .collection("products")
    .insertOne(newProduct)
    .then((result) => {
      console.log(result);
      res
        .status(201)
        .json({ message: "Product Added", productId: result.insertedId });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  db.getDb()
    .db()
    .collection("products")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedProduct })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        productId: req.params.id.toString(),
      });
    })
    .catch((err) => console.log(err));

  console.log(updatedProduct);
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      res.status(200).json({ message: "Product deleted" });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
