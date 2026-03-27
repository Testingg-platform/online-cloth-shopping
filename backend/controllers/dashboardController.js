import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const getDashboardSummary = async (req, res) => {
  try {
    const daysRequested = parseInt(req.query.days) || 7;
    const [totalProducts, totalOrders, paidOrders, pendingOrders, orderBreakdown, users, trend, topProducts] = await Promise.all([
      productModel.countDocuments(),
      orderModel.countDocuments(),
      orderModel.countDocuments({ payment: true }),
      orderModel.countDocuments({ payment: false }),
      orderModel.aggregate([
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 }
          }
        }
      ]),
      userModel.find().select('cartData wishlistData').lean(),
      (async () => {
        const now = Date.now()
        const start = now - (daysRequested - 1) * 24 * 60 * 60 * 1000
        const aggregate = await orderModel.aggregate([
          { $match: { date: { $gte: start } } },
          {
            $project: {
              amount: 1,
              day: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: { $toDate: '$date' }
                }
              }
            }
          },
          {
            $group: {
              _id: '$day',
              count: { $sum: 1 },
              revenue: { $sum: '$amount' }
            }
          },
          { $sort: { _id: 1 } }
        ])
        const days = Array.from({ length: daysRequested }, (_, i) => {
          const date = new Date(start + i * 24 * 60 * 60 * 1000)
          const label = date.toISOString().slice(0, 10)
          return label
        })
        const map = new Map(aggregate.map(item => [item._id, item]))
        return days.map(label => ({
          day: label,
          count: map.get(label)?.count || 0,
          revenue: map.get(label)?.revenue || 0
        }))
      })()
      ,
      (async () => {
        const productTrend = await orderModel.aggregate([
          { $unwind: "$items" },
          {
            $group: {
              _id: { $ifNull: ["$items.productId", "$items._id"] },
              name: { $first: "$items.name" },
              quantity: { $sum: { $ifNull: ["$items.quantity", 1] } },
              revenue: {
                $sum: {
                  $multiply: [
                    { $ifNull: ["$items.price", 0] },
                    { $ifNull: ["$items.quantity", 1] }
                  ]
                }
              }
            }
          },
          { $sort: { quantity: -1 } },
          { $limit: 5 }
        ])
        return productTrend
      })()
    ])

    const totalRevenueAgg = await orderModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    const totalRevenue = totalRevenueAgg[0]?.total || 0

    let totalCartItems = 0
    let totalWishlistItems = 0
    users.forEach((user) => {
      const wishlistData = Array.isArray(user.wishlistData) ? user.wishlistData : []
      totalWishlistItems += wishlistData.length
      const cartData = user.cartData || {}
      Object.values(cartData).forEach((sizeMap) => {
        Object.values(sizeMap || {}).forEach((qty) => {
          totalCartItems += Number(qty || 0)
        })
      })
    })

    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0
    const paymentBreakdown = orderBreakdown.reduce(
      (acc, bucket) => ({ ...acc, [bucket._id || "Unknown"]: bucket.count }),
      {}
    )

    res.json({
      success: true,
      summary: {
        totalProducts,
        totalOrders,
        paidOrders,
        pendingOrders,
        totalRevenue,
        averageOrderValue,
        totalUsers: users.length,
        totalCartItems,
        totalWishlistItems,
        paymentBreakdown,
        trend: trend || [],
        topProducts: (topProducts || []).map(product => ({
          id: product._id,
          name: product.name,
          quantity: product.quantity,
          revenue: product.revenue
        }))
      }
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { getDashboardSummary }
