'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from '@/hooks/use-toast' 

interface Driver {
  _id: string
  driverId: string
  name: string
  email: string
  phone: string
  vehicleType: string
  status: string
  onlineTime: number
}

export function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
  })
  const [paymentDetails, setPaymentDetails] = useState<{ onlineTime: number } | null>(null)
  const [isAddingDriver, setIsAddingDriver] = useState(true)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://backend-delivery-management.vercel.app/api/drivers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch drivers')
      }
      const data = await response.json()
      setDrivers(data.data)
    } catch (err) {
      setError('Failed to fetch drivers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const createDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('https://backend-delivery-management.vercel.app/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newDriver),
      })
      if (!response.ok) {
        throw new Error('Failed to create driver')
      }
      const data = await response.json()
      setDrivers([...drivers, data.data])
      setNewDriver({ name: '', email: '', phone: '', vehicleType: '' })
      toast({
        title: "Driver Created",
        description: "New driver has been created successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create driver. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateDriverStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`https://backend-delivery-management.vercel.app/api/drivers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error('Failed to update driver status')
      }
      setDrivers(drivers.map(driver => 
        driver._id === id ? { ...driver, status } : driver
      ))
      toast({
        title: "Driver Status Updated",
        description: `Driver has been ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update driver status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteDriver = async (id: string) => {
    try {
      const response = await fetch(`https://backend-delivery-management.vercel.app/api/drivers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete driver')
      }
      setDrivers(drivers.filter(driver => driver._id !== id))
      toast({
        title: "Driver Deleted",
        description: "Driver has been deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete driver. Please try again.",
        variant: "destructive",
      })
    }
  }

  const calculatePayment = async (driverId: string) => {
    try {
      const response = await fetch(`https://backend-delivery-management.vercel.app/api/drivers/${driverId}/payment`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to calculate payment')
      }
      const data = await response.json()
      setPaymentDetails(data)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to calculate payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateOnlineTime = async (driverId: string, hours: number) => {
    try {
      const response = await fetch(`https://backend-delivery-management.vercel.app/api/drivers/${driverId}/online-time`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ onlineTime: hours }),
      })
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to update online time')
      }
      setDrivers(drivers.map(driver => 
        driver.driverId === driverId ? { ...driver, onlineTime: driver.onlineTime + hours } : driver
      ))
      toast({
        title: "Online Time Updated",
        description: "Driver's online time has been updated successfully",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to update online time. Please try again. ${err.message}`,
        variant: "destructive",
      })
    }
  }

  const resetOnlineTime = async (driverId: string) => {
    try {
      const response = await fetch(`https://backend-delivery-management.vercel.app/api/drivers/${driverId}/online-time/reset`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to reset online time')
      }
      setDrivers(drivers.map(driver => 
        driver.driverId === driverId ? { ...driver, onlineTime: 0 } : driver
      ))
      toast({
        title: "Online Time Reset",
        description: "Driver's online time has been reset successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reset online time. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading drivers...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-4">
        <Button onClick={() => setIsAddingDriver(true)} variant={isAddingDriver ? 'default' : 'outline'}>
          Add Driver
        </Button>
        <Button onClick={() => setIsAddingDriver(false)} variant={!isAddingDriver ? 'default' : 'outline'}>
          Manage Driver
        </Button>
      </div>

      {isAddingDriver ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createDriver} className="space-y-4">
              <Input
                placeholder="Name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={newDriver.email}
                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                required
              />
              <Input
                placeholder="Phone"
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                required
              />
              <Input
                placeholder="Vehicle Type"
                value={newDriver.vehicleType}
                onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
                required
              />
              <Button type="submit">Add Driver</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Drivers</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto md:overflow-x-hidden">
            <Table className="w-full min-w-max">
              <TableHeader>
                <TableRow>
                  <TableHead>Driver ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Online Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-scroll max-h-96">
                {drivers.map((driver) => (
                  <TableRow key={driver._id} className="break-inside-avoid-all">
                    <TableCell>{driver.driverId}</TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.vehicleType}</TableCell>
                    <TableCell>{driver.status}</TableCell>
                    <TableCell>{driver.onlineTime} hours</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => updateDriverStatus(driver._id, driver.status === 'active' ? 'inactive' : 'active')}
                          variant={driver.status === 'active' ? 'destructive' : 'default'}
                        >
                          {driver.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="destructive" onClick={() => deleteDriver(driver._id)}>Delete</Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => calculatePayment(driver.driverId)}>
                              Calculate Payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Payment Details</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              {paymentDetails && (
                                <p>Online Time: {paymentDetails.onlineTime} hours</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => updateOnlineTime(driver.driverId, 1)}>
                            Add 1 Hour
                          </Button>
                          <Button variant="outline" onClick={() => resetOnlineTime(driver.driverId)}>
                            Reset Time
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

