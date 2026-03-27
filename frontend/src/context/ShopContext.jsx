import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { products as localProducts } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        if (!token) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        toast.success('Added to cart')

        try {
            await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const addToWishlist = async (itemId) => {
        if (!token) {
            toast.error('Please login to use wishlist');
            navigate('/login');
            return false;
        }

        if (wishlistItems.includes(itemId)) {
            return true;
        }

        const nextWishlist = [...wishlistItems, itemId];
        setWishlistItems(nextWishlist);

        try {
            await axios.post(backendUrl + '/api/wishlist/add', { itemId }, { headers: { token } })
            toast.success('Added to wishlist')
            return true;
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return false;
        }
    }

    const removeFromWishlist = async (itemId) => {
        if (!token) {
            toast.error('Please login to use wishlist');
            navigate('/login');
            return false;
        }

        const nextWishlist = wishlistItems.filter((id) => id !== itemId);
        setWishlistItems(nextWishlist);

        try {
            await axios.post(backendUrl + '/api/wishlist/remove', { itemId }, { headers: { token } })
            toast.info('Removed from wishlist')
            return true;
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return false;
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const normalizeName = (value) => (value || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    const getSubCategoryFromName = (name) => {
        const n = normalizeName(name);
        if (n.includes('jacket') || n.includes('hoodie') || n.includes('cardigan') || n.includes('coat')) return 'Winterwear';
        if (n.includes('jean') || n.includes('pant') || n.includes('trouser') || n.includes('jogger')) return 'Bottomwear';
        return 'Topwear';
    };

    const hashToIndex = (value, length) => {
        if (!length) return 0;
        let hash = 0;
        for (let i = 0; i < value.length; i += 1) {
            hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
        }
        return hash % length;
    };

    const pickLocalImages = (product) => {
        const category = product.category || '';
        const desiredSub = product.subCategory || getSubCategoryFromName(product.name);
        const byCategory = localProducts.filter((p) => p.category === category);
        const byCatSub = byCategory.filter((p) => p.subCategory === desiredSub);
        const pool = byCatSub.length ? byCatSub : (byCategory.length ? byCategory : localProducts);
        const idx = hashToIndex(normalizeName(product.name), pool.length);
        return pool[idx]?.image || localProducts[idx % localProducts.length]?.image || [];
    };

    const remapProductImages = (productsFromApi) => {
        return productsFromApi.map((p) => {
            const firstImage = Array.isArray(p.image) ? p.image[0] : '';
            const needsReplace = typeof firstImage === 'string' && firstImage.includes('picsum.photos');
            if (!needsReplace) return p;
            return { ...p, image: pickLocalImages(p) };
        });
    };

    const getCategoriesData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/category/list')
            if (response.data.success) {
                setCategories(response.data.categories)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getSubCategoriesData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/subcategory/list')
            if (response.data.success) {
                setSubCategories(response.data.subcategories)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProductsData = async (options = {}) => {
        const { silent = false } = options;
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success && Array.isArray(response.data.products) && response.data.products.length > 0) {
                const mapped = remapProductImages(response.data.products);
                setProducts(mapped.reverse())
            } else {
                if (!silent && response.data?.message) {
                    toast.error(response.data.message)
                }
                setProducts(localProducts)
            }

        } catch (error) {
            console.log(error)
            if (!silent) {
                toast.error(error.message)
            }
            setProducts(localProducts)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserWishlist = async ( token ) => {
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/get', {}, { headers: { token } })
            if (response.data.success) {
                const wishlistData = Array.isArray(response.data.wishlistData) ? response.data.wishlistData : []
                setWishlistItems(wishlistData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
        getCategoriesData()
        getSubCategoriesData()

        const refreshIntervalMs = 15000;
        const intervalId = setInterval(() => {
            getProductsData({ silent: true })
            getCategoriesData()
            getSubCategoriesData()
        }, refreshIntervalMs)

        const handleFocus = () => {
            getProductsData({ silent: true })
            getCategoriesData()
            getSubCategoriesData()
        }
        window.addEventListener('focus', handleFocus)

        return () => {
            clearInterval(intervalId)
            window.removeEventListener('focus', handleFocus)
        }
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            getUserWishlist(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
            getUserWishlist(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        wishlistItems, setWishlistItems, addToWishlist, removeFromWishlist,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        categories, subCategories
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
