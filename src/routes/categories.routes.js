import { Router } from 'express'
import { prisma } from '../db.js'

const router = Router()

// Validate if category exists
const validateCategoryExist = async (id) => {
  const categoryFound = await prisma.category.findFirst({
    where: { id: Number(id) },
    include: { products: true }
  })

  return categoryFound;
}

// Get all categories
router.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { products: true }
  })
  res.json(categories)
})

// Get a category
router.get('/categories/:id', async (req, res) => {
  const categoryFound = await validateCategoryExist(req.params.id)

  if(categoryFound === null) {
    return res.status(404).json({ 'error': 'Category not found!' })
  }

  return res.json(categoryFound);
})

// Create category
router.post('/categories', async (req, res) => {
  const newCategory = await prisma.category.create({
    data: req.body
  })

  return res.json(newCategory)
})

// Delete category
router.delete('/categories/:id', async (req, res) => {
  const categoryDelete = await validateCategoryExist(req.params.id)

  if(categoryDelete === null) {
    return res.status(404).json({ 'error': 'Category not found!' })
  }

  if(categoryDelete.name === 'default' || categoryDelete.id === 9) {
    return res.status(505).json({ 'error': 'Category cannot be eliminated!' })
  }

  // We move the products to a default category
  await prisma.product.updateMany({
    where: { categoryId: Number(req.params.id) },
    data: { categoryId: 9 }
  })

  await prisma.category.delete({
    where: { id: Number(req.params.id) }
  })

  return res.json(categoryDelete)
})

// Update category
router.put('/categories/:id', async (req, res) => {
  const categoryUpdate = await validateCategoryExist(req.params.id)

  if(categoryUpdate === null) {
    return res.status(404).json({ 'error': 'The category does not exist!' })
  }

  if(categoryUpdate.name === 'default' || categoryUpdate.id === 9) {
    return res.json(505).json({ 'error': 'This category cannot be updated!' })
  }

  await prisma.category.update({
    where: { id: res.params.id },
    data: req.body
  })

  return res.json(categoryUpdate)
})


export default router