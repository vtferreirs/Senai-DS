import { Router } from "express";


const router = Router();

console.log("Arquivo productRoutes carregado");

const products = [
    {
        id: 1,
        name: "Notebook Gamer",
        price: 5000
    }
];

router.get("/", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Erro ao buscar produtos."
        });

    }

});

router.post("/", (req, res) => {
    console.log("Entrou na rota POST /products");

    const newProduct = {  
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name: req.body.name,
        preco: req.body.preco
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

router.delete("/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    console.log(`Entrou na rota DELETE /products/${productId}`);
    
    const productIndex = products.findIndex((p) => p.id === productId);

    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json(deletedProduct);
});

router.put("/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    console.log(`Entrou na rota PUT /products/${productId}`);

    const product = products.find((p) => p.id === productId);

    
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.preco !== undefined) product.preco = req.body.preco;

    res.json(product);
});

export default router;
