import React, { useState } from 'react'
import { base44 } from '@/api/base44Client'

export default function SignUpForm({ variant = 'dark' }) {
	const [email, setEmail] = useState('')
	const [sent, setSent] = useState(false)
	const [error, setError] = useState('')

	const submit = async (e) => {
		e.preventDefault()
		if (!email.trim()) return
		try {
			await base44.entities.Lead.create({ email, source: 'signup' })
			setSent(true)
			setEmail('')
			setError('')
		} catch {
			setError('Unable to subscribe right now. Please try again.')
		}
	}

	return (
		<section className={`${variant === 'dark' ? 'bg-white/5' : 'bg-white'} border-y border-white/5`}>
			<div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
				<div>
					<p className="font-mono-body text-[10px] uppercase tracking-widest text-brand mb-2">Stay in the loop</p>
					<h2 className="font-heading text-2xl font-bold text-white">Product drops & retail playbooks.</h2>
				</div>
				{sent ? (
					<p className="font-mono-body text-sm text-green-400">Thanks — you&apos;re on the list.</p>
				) : (
					<form onSubmit={submit} className="flex w-full md:w-auto">
						<input
							value={email}
							onChange={e => setEmail(e.target.value)}
							type="email"
							placeholder="you@business.com"
							  className="flex-1 md:w-72 bg-white border border-white/10 rounded-l-full px-5 py-3 text-sm text-black placeholder:text-gray-500 outline-none"
							required
						/>
						<button
							type="submit"
							className="bg-brand hover:bg-brand-dark text-white rounded-r-full px-5 font-mono-body text-[11px] uppercase tracking-widest transition-colors"
						>
							Subscribe
						</button>
						{error && <p className="absolute mt-12 text-xs text-red-300">{error}</p>}
					</form>
				)}
			</div>
		</section>
	)
}
