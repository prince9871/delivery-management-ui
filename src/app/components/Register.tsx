'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export function Register() {
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [role, setRole] = useState('User')
 const [loading, setLoading] = useState(false)
 const router = useRouter()

 const handleRegister = async (e: React.FormEvent) => {
   e.preventDefault()
   setLoading(true)

   try {
     const response = await fetch('https://backend-delivery-management.vercel.app/api/auth/register', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ name, email, password, role }),
     })

     if (!response.ok) {
       throw new Error('Registration failed')
     }

     router.push('/login')
     toast({
       title: "Registration Successful",
       description: "Please login with your new account",
     })
   } catch (err) {
     toast({
       title: "Registration Failed",
       description: "Please try again",
       variant: "destructive",
     })
   } finally {
     setLoading(false)
   }
 }

 return (
   <Card className="w-full max-w-md mx-auto">
     <CardHeader>
       <CardTitle>Register</CardTitle>
     </CardHeader>
     <CardContent>
       <form onSubmit={handleRegister} className="space-y-4">
         <div>
           <Input
             type="text"
             placeholder="Name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             required
           />
         </div>
         <div>
           <Input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
         </div>
         <div>
           <Input
             type="password"
             placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
         </div>
         <div>
           <Select onValueChange={(value) => setRole(value)} defaultValue={role}>
             <SelectTrigger>
               <SelectValue placeholder="Select role" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="User">User</SelectItem>
               <SelectItem value="Admin">Admin</SelectItem>
             </SelectContent>
           </Select>
         </div>
         <Button type="submit" className="w-full" disabled={loading}>
           {loading ? 'Registering...' : 'Register'}
         </Button>
       </form>
     </CardContent>
     <CardFooter className="justify-center">
       <p>Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login here</Link></p>
     </CardFooter>
   </Card>
 )
}

