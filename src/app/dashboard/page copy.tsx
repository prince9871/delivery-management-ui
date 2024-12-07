'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import dynamic from 'next/dynamic'
import { toast } from '@/hooks/use-toast'

interface Driver {
  _id: string
  driverId: string
  name: string
  status: string
}

interface Order {
  _id: string
  orderId: string
  customerName: string
  totalAmount: number
  orderStatus: string
}

interface Route {
  _id: string
  routeId: string
  orderId: string
  driverId: string
  status: string
  steps: {
    location: {
      latitude: number
      longitude: number
    }
  }[]
}

interface MapProps {
  routes: Route[]
}

const MapWithNoSSR = dynamic<MapProps>(() => import('@/app/components/Map'), { 
  ssr: false,
  loading: () => <div>Loading map...</div>
})

interface ApiResponse<T> {
  data: T[]
  status: number
  message: string
}

export default function DashboardPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, ordersRes, routesRes] = await Promise.all([
          fetch('https://backend-delivery-management.vercel.app/api/drivers', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('https://backend-delivery-management.vercel.app/api/orders', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('https://backend-delivery-management.vercel.app/api/routes', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ])

        if (!driversRes.ok || !ordersRes.ok || !routesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [driversData, ordersData, routesData]: [
          ApiResponse<Driver>,
          ApiResponse<Order>,
          ApiResponse<Route>
        ] = await Promise.all([
          driversRes.json(),
          ordersRes.json(),
          routesRes.json()
        ])

        setDrivers(driversData.data)
        setOrders(ordersData.data)
        setRoutes(routesData.data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{drivers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{routes.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.slice(0, 5).map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>{driver.driverId}</TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <MapWithNoSSR routes={routes.slice(0, 5)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}