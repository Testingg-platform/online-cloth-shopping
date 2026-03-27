import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const productsDir = path.join(__dirname, '..', 'public', 'products')
const catalogPath = path.join(__dirname, '..', 'data', 'localProducts.json')

let imageFiles = []
try {
    imageFiles = fs.readdirSync(productsDir)
        .filter((file) => file.toLowerCase().endsWith('.png'))
        .sort()
} catch (error) {
    imageFiles = []
}

let localCatalog = []
try {
    localCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
} catch (error) {
    localCatalog = []
}

const nameIndex = new Map()
const categoryIndex = new Map()
for (const item of localCatalog) {
    const key = String(item?.name || '').toLowerCase().trim()
    if (key) nameIndex.set(key, item)
    const catKey = `${item?.category || ''}|${item?.subCategory || ''}`.toLowerCase()
    if (!categoryIndex.has(catKey)) categoryIndex.set(catKey, [])
    categoryIndex.get(catKey).push(item)
}

const normalizeName = (value) => String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()

const getSubCategoryFromName = (name) => {
    const n = normalizeName(name)
    if (n.includes('jacket') || n.includes('hoodie') || n.includes('cardigan') || n.includes('coat')) return 'Winterwear'
    if (n.includes('jean') || n.includes('pant') || n.includes('trouser') || n.includes('jogger')) return 'Bottomwear'
    return 'Topwear'
}

const hashToIndex = (value, length) => {
    if (!length) return 0
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0
    }
    return hash % length
}

const toPlain = (doc) => {
    if (doc && typeof doc.toObject === 'function') return doc.toObject()
    return doc
}

const shouldReplaceImages = (images) => {
    if (!images) return true
    if (Array.isArray(images)) {
        if (images.length === 0) return true
        return images.some((url) => typeof url === 'string' && url.includes('picsum.photos'))
    }
    if (typeof images === 'string') {
        return images.includes('picsum.photos')
    }
    return true
}

const filesToUrls = (files, baseUrl) => {
    if (!Array.isArray(files) || !files.length) return null
    const urls = files
        .filter((file) => typeof file === 'string' && file.trim())
        .map((file) => `${baseUrl}/static/products/${file}`)
    return urls.length ? urls : null
}

const pickLocalImageUrls = (product, baseUrl) => {
    if (!imageFiles.length) return null

    const productNameKey = String(product?.name || '').toLowerCase().trim()
    const exact = nameIndex.get(productNameKey)
    if (exact?.image?.length) {
        return filesToUrls(exact.image, baseUrl)
    }

    const subCategory = product.subCategory || getSubCategoryFromName(product.name)
    const catKey = `${product.category || ''}|${subCategory}`.toLowerCase()
    const pool = categoryIndex.get(catKey) || []
    if (pool.length) {
        const idx = hashToIndex(normalizeName(productNameKey), pool.length)
        const urls = filesToUrls(pool[idx]?.image || [], baseUrl)
        if (urls) return urls
    }

    const key = normalizeName(`${product.category || ''} ${subCategory} ${product.name || ''}`)
    const idx = hashToIndex(key, imageFiles.length)
    const file = imageFiles[idx]
    return file ? [`${baseUrl}/static/products/${file}`] : null
}

const mapProductImages = (products, baseUrl) => {
    if (!Array.isArray(products)) return products
    return products.map((product) => {
        const plain = toPlain(product)
        if (!shouldReplaceImages(plain.image)) return plain
        const urls = pickLocalImageUrls(plain, baseUrl)
        if (!urls) return plain
        return { ...plain, image: urls }
    })
}

const mapOrderImages = (orders, baseUrl) => {
    if (!Array.isArray(orders)) return orders
    return orders.map((order) => {
        const plainOrder = toPlain(order)
        const items = Array.isArray(plainOrder.items) ? plainOrder.items.map((item) => {
            const plainItem = toPlain(item)
            if (!shouldReplaceImages(plainItem.image)) return plainItem
            const urls = pickLocalImageUrls(plainItem, baseUrl)
            if (!urls) return plainItem
            return { ...plainItem, image: urls }
        }) : plainOrder.items
        return { ...plainOrder, items }
    })
}

export { mapProductImages, mapOrderImages }
