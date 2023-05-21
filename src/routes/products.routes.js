import { Router } from 'express'
import { prisma } from '../db.js';

const router = Router()

// Validate if product exists
const validateProductExist = async (id) => {
  const productFound = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: { category: true }
  })
  return productFound;
}

// Get all products
router.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true }
  })
  return res.json(products)
})

// Get a product
router.get('/products/:id', async (req, res) => {
  const productFound = await validateProductExist(req.params.id)

  if(productFound === null) {
    return res.status(404).json({ 'error': 'Product not found!' })
  }

  return res.json(productFound)
})

// Create a product
router.post('/products', async (req, res) => {
  const newProduct = await prisma.product.create({
    data: req.body
  })
  return res.json(newProduct)  
})

// Delete a product
router.delete('/products/:id', async (req, res) => {
  const productDelete = await validateProductExist(req.params.id)

  if(productDelete === null) {
    return res.status(404).json({ 'error': 'Product not found!' })
  }

  await prisma.product.delete({
    where: { id: Number(req.params.id) }
  })

  return res.json(productDelete)
})

// Update a product
router.put('/products/:id', async (req, res) => {
  const productUpdate = await validateProductExist(req.params.id)

  if(productUpdate === null) {
    return res.status(404).json({ 'error': 'Product not found!' })
  }

  await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: req.body
  })

  return res.json(productUpdate)
})

export default router