'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export function Login() {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [loading, setLoading] = useState(false)
 const router = useRouter()

 const handleLogin = async (e: React.FormEvent) => {
   e.preventDefault()
   setLoading(true)

   try {
     const response = await fetch('https://backend-delivery-management.vercel.app/api/auth/login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ email, password }),
     })

     if (!response.ok) {
       throw new Error('Login failed')
     }

     const data = await response.json()
     localStorage.setItem('token', data.token)
    //  localStorage.setItem('userRole', data.user.role)
     router.push('/dashboard')
     toast({
       title: "Login Successful",
       description: "Welcome back!",
     })
   } catch (err) {
     toast({
       title: "Login Failed",
       description: err instanceof Error ? err.message : "Invalid email or password",
       variant: "destructive",
     })
   } finally {
     setLoading(false)
   }
 }

 return (
   <Card className="w-full max-w-md">
     <CardHeader className="text-center">
       <CardTitle className="text-2xl font-bold">Delivery Management System</CardTitle>
     </CardHeader>
     <CardContent>
       <form onSubmit={handleLogin} className="space-y-4">
         <div>
           <Input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="w-full"
           />
         </div>
         <div>
           <Input
             type="password"
             placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             className="w-full"
           />
         </div>
         <Button type="submit" className="w-full" disabled={loading}>
           {loading ? 'Logging in...' : 'Login'}
         </Button>
       </form>
     </CardContent>
     <CardFooter className="justify-center">
       <p>Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link></p>
     </CardFooter>
   </Card>
 )
}

