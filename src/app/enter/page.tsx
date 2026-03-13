'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { hasSupabaseEnv, supabaseClient } from '@/lib/supabase-client'
import { useLang } from '@/lib/use-lang'
import { useAuthStore } from '@/stores/auth-store'
import { LayersIcon } from 'lucide-react'

// Thiết lập Schema Validate bằng Zod
const authSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Vui lòng nhập email / Email is required' })
		.email({ message: 'Email không đúng định dạng / Invalid email' }),
	password: z
		.string()
		.min(6, { message: 'Mật khẩu tối thiểu 6 ký tự / Min 6 characters' }),
})

type AuthFormData = z.infer<typeof authSchema>

// Các class UI dùng chung
const panelClass =
	'rounded-3xl border border-border bg-card/40 backdrop-blur-xl shadow-xl'
const primaryButtonClass =
	'inline-flex h-12 w-full items-center justify-center rounded-xl bg-foreground px-6 font-semibold text-background transition-all hover:scale-[1.02] hover:bg-foreground/90 shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
const secondaryButtonClass =
	'inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-secondary/80 backdrop-blur-md px-6 font-semibold text-secondary-foreground transition-all hover:bg-secondary hover:border-ring/50 disabled:cursor-not-allowed disabled:opacity-50'

export default function EnterPage() {
	const { lang, setLang, t } = useLang()
	const sessionEmail = useAuthStore((state) => state.authUser?.email ?? null)
	const [loading, setLoading] = useState(false)
	const [notice, setNotice] = useState<{
		type: 'error' | 'success'
		message: string
	} | null>(null)

	// Khởi tạo React Hook Form + Zod
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthFormData>({
		resolver: zodResolver(authSchema),
	})

	// Xử lý Đăng nhập
	const onSignIn = async (data: AuthFormData) => {
		if (!supabaseClient) return
		setLoading(true)
		setNotice(null)

		const { error } = await supabaseClient.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		})

		setLoading(false)
		if (error) {
			setNotice({ type: 'error', message: error.message })
		}
	}

	// Xử lý Đăng ký
	const onSignUp = async (data: AuthFormData) => {
		if (!supabaseClient) return
		setLoading(true)
		setNotice(null)

		const { error } = await supabaseClient.auth.signUp({
			email: data.email,
			password: data.password,
			options: { emailRedirectTo: `${window.location.origin}/enter` },
		})

		setLoading(false)
		if (error) {
			setNotice({ type: 'error', message: error.message })
		} else {
			setNotice({ type: 'success', message: t('enter.successSignUp') })
		}
	}

	// Xử lý OAuth
	const signInOAuth = async (provider: 'google' | 'github') => {
		if (!supabaseClient) return
		setLoading(true)
		setNotice(null)

		const { error } = await supabaseClient.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${window.location.origin}/enter` },
		})
		if (error) {
			setLoading(false)
			setNotice({ type: 'error', message: error.message })
		}
	}

	const signOut = async () => {
		if (!supabaseClient) return
		await supabaseClient.auth.signOut()
		setNotice(null)
	}

	return (
		<main className='relative min-h-screen w-full px-4 pb-16 pt-6 md:px-8 xl:px-16 overflow-hidden flex flex-col'>
			{/* Hiệu ứng Background (Đồng bộ từ Home) */}
			<div className='pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-30 [background-image:radial-gradient(var(--tw-gradient-stops))] from-primary/5 to-transparent bg-[length:16px_16px] [background-image:radial-gradient(rgba(170,186,242,0.3)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(170,186,242,0.1)_1px,transparent_1px)]' />

			<section
				className={`relative z-[1] mt-6 md:mt-12 grid gap-10 md:gap-16 lg:grid-cols-[1.2fr_1fr] flex-1 items-center max-w-7xl mx-auto w-full`}>
				{/* Bên trái: Text (Chạy xuống dưới cùng trên Mobile) */}
				<div className='flex flex-col justify-center h-full order-2 lg:order-1 text-center lg:text-left pb-10 lg:pb-0'>
					<div className='hidden lg:inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-6 w-fit'>
						<p className='font-mono text-xs font-bold tracking-widest text-primary uppercase'>
							AUTH / ENTER
						</p>
					</div>

					<h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] tracking-tight text-foreground'>
						{t('enter.title')}
					</h1>
					<p className='mt-4 lg:mt-6 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0'>
						{t('enter.description')}
					</p>

					<div className='mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'>
						<Link
							className='inline-flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 transition-all px-6 py-2.5 font-semibold w-full sm:w-auto'
							href='/#demo'>
							{t('enter.demo')}
						</Link>
						<a
							className='text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors underline-offset-8 hover:underline mt-2 sm:mt-0'
							href='https://hndb.app/docs'
							target='_blank'
							rel='noreferrer'>
							{t('enter.onboard')}
						</a>
					</div>
				</div>

				{/* Bên phải: Form Đăng nhập (Lên trên cùng trên Mobile) */}
				<div
					className={`order-1 lg:order-2 rounded-3xl p-6 md:p-8 ${panelClass}`}>
					{sessionEmail ?
						<div className='flex flex-col gap-4 text-center py-6'>
							<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2'>
								<LayersIcon className='w-8 h-8 text-primary' />
							</div>
							<h3 className='text-xl font-bold text-foreground'>
								Đã đăng nhập
							</h3>
							<p className='text-sm text-muted-foreground'>
								{t('enter.session')}: <br />
								<strong className='text-foreground mt-1 block'>
									{sessionEmail}
								</strong>
							</p>
							<button
								type='button'
								className={`${secondaryButtonClass} mt-4`}
								onClick={signOut}>
								{t('enter.logout')}
							</button>
						</div>
					:	<>
							<form className='flex flex-col gap-4'>
								{/* Field Email */}
								<div>
									<label
										htmlFor='email'
										className='mb-2 block text-xs font-bold text-foreground uppercase tracking-wider'>
										{t('enter.email')}
									</label>
									<input
										id='email'
										type='email'
										placeholder='hello@hndb.app'
										{...register('email')}
										className={`h-12 w-full rounded-xl border bg-background/50 px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/40
											${errors.email ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30' : 'border-border focus:border-ring/50 focus:bg-background/80 focus:ring-1 focus:ring-ring/30'}
										`}
									/>
									{errors.email && (
										<span className='mt-1.5 block text-xs font-medium text-destructive'>
											{errors.email.message}
										</span>
									)}
								</div>

								{/* Field Password */}
								<div>
									<label
										htmlFor='password'
										className='mb-2 block text-xs font-bold text-foreground uppercase tracking-wider'>
										{t('enter.password')}
									</label>
									<input
										id='password'
										type='password'
										placeholder='••••••••'
										{...register('password')}
										className={`h-12 w-full rounded-xl border bg-background/50 px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/40
											${errors.password ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30' : 'border-border focus:border-ring/50 focus:bg-background/80 focus:ring-1 focus:ring-ring/30'}
										`}
									/>
									{errors.password && (
										<span className='mt-1.5 block text-xs font-medium text-destructive'>
											{errors.password.message}
										</span>
									)}
								</div>

								{/* Nút Submit xếp tự động theo màn hình */}
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'>
									<button
										type='button'
										onClick={handleSubmit(onSignIn)}
										className={primaryButtonClass}
										disabled={loading || !hasSupabaseEnv}>
										{t('enter.signIn')}
									</button>
									<button
										type='button'
										onClick={handleSubmit(onSignUp)}
										className={secondaryButtonClass}
										disabled={loading || !hasSupabaseEnv}>
										{t('enter.signUp')}
									</button>
								</div>
							</form>

							<div className='relative mt-8 mb-6'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-border'></div>
								</div>
								<div className='relative flex justify-center text-xs'>
									<span className='bg-card px-3 font-semibold text-muted-foreground uppercase tracking-wider'>
										{t('enter.or')}
									</span>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
								<button
									type='button'
									onClick={() => signInOAuth('google')}
									disabled={loading || !hasSupabaseEnv}
									className='inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-border bg-background/50 px-4 text-sm font-semibold transition-all hover:bg-background hover:border-border disabled:cursor-not-allowed disabled:opacity-50 text-foreground'>
									<Image
										src='/providers/google.svg'
										alt='Google'
										width={18}
										height={18}
									/>
									<span>Google</span>
								</button>
								<button
									type='button'
									onClick={() => signInOAuth('github')}
									disabled={loading || !hasSupabaseEnv}
									className='inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-border bg-background/50 px-4 text-sm font-semibold transition-all hover:bg-background hover:border-border disabled:cursor-not-allowed disabled:opacity-50 text-foreground'>
									<Image
										src='/providers/github.png'
										alt='GitHub'
										width={18}
										height={18}
										className='opacity-80 dark:invert'
									/>
									<span>GitHub</span>
								</button>
							</div>

							{/* Thông báo lỗi từ môi trường hoặc Supabase */}
							{!hasSupabaseEnv && (
								<div className='mt-6 p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-center text-sm font-medium text-destructive'>
									{t('enter.envMissing')}
								</div>
							)}
							{notice && (
								<div
									className={`mt-6 p-3 rounded-xl border text-center text-sm font-medium ${
										notice.type === 'error' ?
											'border-destructive/20 bg-destructive/10 text-destructive'
										:	'border-primary/20 bg-primary/10 text-primary'
									}`}>
									{notice.message}
								</div>
							)}
						</>
					}
				</div>
			</section>
		</main>
	)
}
