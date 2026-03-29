import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const MetricCard = ({ label, value, helper, accent }) => (
  <div className={`rounded-2xl border border-[#dfe4ef] bg-white p-5 shadow-sm transition`}>
    <p className='text-[10px] uppercase tracking-widest text-gray-400'>{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${accent || 'text-gray-900'}`}>{value}</p>
    {helper ? <p className='text-xs text-gray-500'>{helper}</p> : null}
  </div>
)

const BreakdownBar = ({ label, value, max, color }) => {
  const width = max ? (value / max) * 100 : 0
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center justify-between text-xs text-gray-500'>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className='h-1.5 rounded-full bg-[#eceff4] overflow-hidden'>
        <div
          className='h-full rounded-full transition-all'
          style={{
            width: `${Math.min(width, 100)}%`,
            background: color || 'linear-gradient(135deg, #7aa6ff, #5b84f1)'
          }}
        />
      </div>
    </div>
  )
}

const DonutChart = ({ data, size = 120, strokeWidth = 18 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className='block'>
      {data.map((item, index) => {
        const dash = total ? (item.value / total) * circumference : 0
        const circle = (
          <circle
            key={item.label + index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='transparent'
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap='round'
            style={{ transition: 'stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease' }}
          />
        )
        offset += dash
        return circle
      })}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius - strokeWidth / 2}
        fill='white'
      />
      <text
        x='50%'
        y='50%'
        textAnchor='middle'
        dominantBaseline='middle'
        className='text-xs font-semibold text-gray-500'
      >
        {total ? `${Math.round((data[0]?.value || 0) / total * 100)}% carts` : 'N/A'}
      </text>
    </svg>
  )
}

const OrderLineChart = ({ trend = [], height = 220 }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!trend.length) {
    return <div className='text-xs text-gray-400'>No order history yet.</div>
  }

  const width = 320
  const padding = 28
  const bottomPadding = 42
  const chartHeight = height - padding - bottomPadding
  const chartWidth = width - padding * 2
  const maxCount = Math.max(...trend.map(point => point.count), 1)
  
  const step = Math.max(Math.ceil(maxCount / 4), 1)
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = Math.max(0, maxCount - step * index)
    const y = padding + (chartHeight / 4) * index
    return { value, y }
  })

  // Calculate points for the line
  const points = trend.map((point, index) => {
    const x = padding + (index * chartWidth) / (trend.length - 1)
    const y = padding + chartHeight - (point.count / maxCount) * chartHeight
    return { x, y, ...point }
  })

  // Create path data for line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  // Create path data for area fill
  const areaPath = `
    ${linePath} 
    L ${points[points.length - 1].x} ${padding + chartHeight} 
    L ${points[0].x} ${padding + chartHeight} 
    Z
  `

  const formatDate = (dateStr) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const [y, m, d] = dateStr.split('-')
    return `${parseInt(d)} ${months[parseInt(m) - 1]}`
  }

  return (
    <div className='relative'>
      <svg viewBox={`0 0 ${width} ${height}`} className='w-full block' style={{ height }} preserveAspectRatio='none'>
        <defs>
          <linearGradient id='lineGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#0ea5e9' stopOpacity='0.4' />
            <stop offset='100%' stopColor='#0ea5e9' stopOpacity='0.0' />
          </linearGradient>
          <linearGradient id='strokeGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#0ea5e9' />
            <stop offset='100%' stopColor='#38bdf8' />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {yTicks.map((tick, index) => (
          <g key={tick.value + index}>
            <line
              x1={padding}
              y1={tick.y}
              x2={padding + chartWidth}
              y2={tick.y}
              stroke='#f8fafc'
              strokeWidth='1'
            />
            <text x={padding - 8} y={tick.y + 3} fontSize='7' textAnchor='end' className='text-[7px] text-gray-400 font-medium'>
              {tick.value}
            </text>
          </g>
        ))}

        {/* Area Fill */}
        <path d={areaPath} fill='url(#lineGradient)' />

        {/* Line */}
        <path d={linePath} fill='none' stroke='url(#strokeGradient)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />

        {/* Data Points and Interaction areas */}
        {points.map((p, index) => {
          const label = formatDate(p.day)
          const labelInterval = trend.length > 14 ? 4 : 1
          const showLabel = (index % labelInterval === 0 || index === trend.length - 1)

          return (
            <g 
              key={index}
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
              className='cursor-pointer'
            >
              {/* Invisible interaction area to make hovering easier */}
              <rect x={p.x - 5} y={0} width={10} height={height} fill='transparent' />

              <line x1={p.x} y1={padding + chartHeight} x2={p.x} y2={padding + chartHeight + 3} stroke='#e2e8f0' strokeWidth='0.5' />
              
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={hoveredPoint?.day === p.day ? 4 : (trend.length > 14 ? '1.5' : '2')} 
                fill={hoveredPoint?.day === p.day ? '#1e293b' : 'white'} 
                stroke={hoveredPoint?.day === p.day ? 'white' : '#0ea5e9'} 
                strokeWidth={hoveredPoint?.day === p.day ? 2 : 1.5} 
                style={{ transition: 'all 0.2s ease' }}
              />

              {showLabel && (
                <text
                  x={p.x}
                  y={padding + chartHeight + 10}
                  textAnchor='end'
                  fontSize='6.5'
                  className='text-[6.5px] text-gray-400 font-medium'
                  transform={`rotate(-45, ${p.x}, ${padding + chartHeight + 10})`}
                >
                  {label}
                </text>
              )}
            </g>
          )
        })}

        {/* Hover Badge / Tooltip */}
        {hoveredPoint && (
          <g transform={`translate(${Math.min(Math.max(hoveredPoint.x - 20, 10), width - 50)}, ${Math.max(hoveredPoint.y - 30, 10)})`}>
            <rect 
              width='45' 
              height='22' 
              rx='4' 
              fill='#1e293b' 
              className='shadow-lg'
            />
            <text x='5' y='8' fontSize='6' fontWeight='bold' fill='white'>{formatDate(hoveredPoint.day)}</text>
            <text x='5' y='16' fontSize='6' fill='white'>{hoveredPoint.count} orders</text>
            
            {/* Tooltip arrow/pointer */}
            <path d='M15 22 L20 27 L25 22 Z' fill='#1e293b' />
          </g>
        )}
      </svg>
    </div>
  )
}

const Dashboard = ({ token }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [trendDays, setTrendDays] = useState(7)

  const fetchSummary = async (days = trendDays) => {
    setLoading(true)
    try {
      const response = await axios.get(backendUrl + `/api/dashboard/summary?days=${days}`, {
        headers: { token }
      })
      if (response.data.success) {
        setSummary(response.data.summary)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchSummary(trendDays)
  }, [token, trendDays])

  const totals = useMemo(() => {
    if (!summary) return []
    return [
      {
        label: 'Total Revenue',
        value: `₹${summary.totalRevenue.toLocaleString()}`,
        helper: `₹${summary.averageOrderValue.toFixed(2)} avg order`,
        accent: 'text-blue-600'
      },
      {
        label: 'Orders processed',
        value: summary.totalOrders,
        helper: `${summary.paidOrders} paid • ${summary.pendingOrders} pending`,
        accent: 'text-gray-900'
      },
      {
        label: 'Products listed',
        value: summary.totalProducts,
        helper: `${summary.totalCartItems} cart adds`,
        accent: 'text-gray-900'
      },
      {
        label: 'Active users',
        value: summary.totalUsers,
        helper: `${summary.totalWishlistItems} wishlist entries`,
        accent: 'text-gray-900'
      }
    ]
  }, [summary])

  const maxPaymentCount = useMemo(() => {
    if (!summary?.paymentBreakdown) return 0
    return Math.max(...Object.values(summary.paymentBreakdown))
  }, [summary])

  const donutData = useMemo(() => {
    if (!summary) return []
    return [
      { label: 'Cart adds', value: summary.totalCartItems, color: '#7aa6ff' },
      { label: 'Wishlist', value: summary.totalWishlistItems, color: '#f97316' }
    ]
  }, [summary])

  const topProducts = summary?.topProducts || []

  const dominantPaymentMethod = useMemo(() => {
    if (!summary?.paymentBreakdown) return 'Not available'
    const entries = Object.entries(summary.paymentBreakdown)
    if (!entries.length) return 'Not available'
    entries.sort((a,b) => b[1] - a[1])
    return entries[0][0] || 'Unknown'
  }, [summary])

  return (
    <div className='admin-panel'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <div>
          <p className='admin-section-title'>Dashboard</p>
          <p className='admin-muted text-sm mt-1'>Site analytics by orders, products, and shoppers.</p>
        </div>
        <button type='button' onClick={() => fetchSummary(trendDays)} className='admin-chip admin-chip-active'>
          Refresh
        </button>
      </div>

      {loading || !summary ? (
        <div className='py-10 text-center text-sm text-gray-400'>{loading ? 'Loading dashboard…' : 'No data yet.'}</div>
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {totals.map(metric => <MetricCard key={metric.label} {...metric} />)}
          </div>

          <div className='mt-6 grid gap-4 lg:grid-cols-2'>
            <div className='admin-card p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-gray-700'>Payment breakdown</p>
                  <p className='text-xs text-gray-400'>Dominant: {dominantPaymentMethod}</p>
                </div>
                <span className='text-xs text-gray-400'>All time</span>
              </div>
              <div className='mt-3 space-y-3'>
                {Object.entries(summary.paymentBreakdown || {}).map(([method, count]) => (
                  <BreakdownBar
                    key={method}
                    label={method || 'Unknown'}
                    value={count}
                    max={maxPaymentCount}
                    color={method === dominantPaymentMethod ? '#5b84f1' : undefined}
                  />
                ))}
              </div>
            </div>
            <div className='admin-card p-5'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold text-gray-700'>Cart vs wishlist</p>
                <span className='text-xs text-gray-400'>Users</span>
              </div>
              <div className='mt-6 flex flex-col items-center gap-4'>
                <DonutChart data={donutData} size={150} />
                <div className='flex flex-col gap-3 text-sm text-gray-600 w-full max-w-sm'>
                  {donutData.map(segment => (
                    <div key={segment.label} className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='h-2 w-2 rounded-full' style={{ background: segment.color }} />
                        <span className='font-semibold text-gray-900'>{segment.label}</span>
                      </div>
                      <span>{segment.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className='text-xs text-gray-500'>
                    Avg cart adds per user: <span className='text-gray-900 font-semibold'>{Math.round(summary.totalCartItems / Math.max(summary.totalUsers, 1))}</span>
                    <br />
                    Avg wishlist per user: <span className='text-gray-900 font-semibold'>{Math.round(summary.totalWishlistItems / Math.max(summary.totalUsers, 1))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 admin-card p-5'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-semibold text-gray-700'>Orders per day</p>
                <p className='text-xs text-gray-400'>Last {trendDays} days</p>
              </div>
              <div className='flex flex-col items-end gap-1'>
                <span className='text-[10px] text-gray-400'>
                  Total orders: {(summary.trend || []).reduce((sum, point) => sum + point.count, 0)}
                </span>
              </div>
            </div>
            <div className='mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-end'>
                  <select 
                    value={trendDays} 
                    onChange={(e) => setTrendDays(Number(e.target.value))}
                    className='text-[10px] bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none cursor-pointer text-gray-600 hover:bg-slate-100 transition'
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={28}>Last 28 days</option>
                  </select>
                </div>
                <div className='flex-1'>
                  <OrderLineChart trend={summary.trend} height={260} />
                </div>
              </div>
              <div className='w-full rounded-2xl border border-[#e2e8f0] bg-[#fefefe] p-4'>
                <p className='text-sm font-semibold text-gray-700 mb-3'>Top products</p>
                {topProducts.length === 0 ? (
                  <p className='text-xs text-gray-400'>No product data yet.</p>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='w-full text-xs text-left text-gray-500'>
                      <thead>
                        <tr>
                          <th className='pb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400'>Product</th>
                          <th className='pb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 text-right'>Qty</th>
                          <th className='pb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 text-right'>Revenue</th>
                        </tr>
                      </thead>
                      <tbody className='text-[11px]'>
                        {topProducts.map(product => (
                          <tr key={product.id} className='border-t border-gray-100'>
                            <td className='pt-3 pb-2 font-semibold text-gray-800'>{product.name}</td>
                            <td className='pt-3 pb-2 text-right'>{product.quantity}</td>
                            <td className='pt-3 pb-2 text-right text-gray-600'>₹{product.revenue?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
