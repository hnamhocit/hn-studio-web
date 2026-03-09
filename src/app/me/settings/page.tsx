'use client'

import {
	ArrowLeftIcon,
	FlameIcon,
	MoonIcon,
	ShieldAlertIcon,
	ShieldCheckIcon,
	SunIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores'

export default function MeSettingsPage() {
	const { user } = useUserStore()

	const [isDarkMode, setIsDarkMode] = useState(
		() =>
			typeof window !== 'undefined' &&
			localStorage.getItem('theme') === 'dark',
	)
	const [settingsForm, setSettingsForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
	})
	const [deleteConfirm, setDeleteConfirm] = useState('')

	const toggleIsDarkMode = () => setIsDarkMode((prev) => !prev)

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
			localStorage.setItem('theme', 'dark')
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.setItem('theme', 'light')
		}
	}, [isDarkMode])

	const handleSaveSettings = () => {
		toast.info('UI only: Save settings API will be connected later.')
	}

	const handleForgotPassword = () => {
		toast.info('UI only: Reset password flow will be connected later.')
	}

	const handleDeleteAccount = () => {
		toast.error('UI only: Delete account flow will be connected later.')
	}

	return (
		<div className='h-full overflow-auto p-4 md:p-6 lg:p-8'>
			<div className='space-y-4'>
				<Link
					href='/'
					className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors'>
					<ArrowLeftIcon size={14} />
					Back
				</Link>

				<div className='rounded-xl border p-5 md:p-6'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Settings
					</h1>
					<p className='mt-2 text-sm text-muted-foreground'>
						Account controls and local preferences.
					</p>
				</div>

				<div className='space-y-4'>
					<div className='rounded-md border p-4 space-y-3'>
						<div className='font-medium'>Account</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
							<div className='space-y-1.5'>
								<div className='text-xs text-muted-foreground'>
									Display name
								</div>
								<Input
									value={settingsForm.name}
									onChange={(e) =>
										setSettingsForm((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									placeholder='Your display name'
								/>
							</div>
							<div className='space-y-1.5'>
								<div className='text-xs text-muted-foreground'>
									Email
								</div>
								<Input
									value={settingsForm.email}
									onChange={(e) =>
										setSettingsForm((prev) => ({
											...prev,
											email: e.target.value,
										}))
									}
									placeholder='you@example.com'
								/>
							</div>
						</div>
						<Button
							size='sm'
							onClick={handleSaveSettings}>
							Save account changes
						</Button>
					</div>

					<div className='rounded-md border p-4 space-y-3'>
						<div className='font-medium'>Security</div>

						<div className='flex items-center justify-between p-3 border-b'>
							<div>
								<div className='text-sm font-medium'>
									Dark mode
								</div>
								<div className='text-xs text-muted-foreground'>
									Toggle UI appearance.
								</div>
							</div>

							<Button
								size='sm'
								variant='outline'
								onClick={toggleIsDarkMode}>
								{isDarkMode ?
									<>
										<MoonIcon />
										Dark
									</>
								:	<>
										<SunIcon />
										Light
									</>
								}
							</Button>
						</div>

						<div className='flex items-center justify-between p-3 border-t'>
							<div className='flex items-start gap-2'>
								<ShieldCheckIcon
									size={16}
									className='mt-0.5 text-muted-foreground'
								/>
								<div>
									<div className='text-sm font-medium'>
										Forgot password
									</div>
									<div className='text-xs text-muted-foreground'>
										Send reset link to your email.
									</div>
								</div>
							</div>
							<Button
								size='sm'
								variant='outline'
								onClick={handleForgotPassword}>
								Send reset link
							</Button>
						</div>
					</div>

					<div className='rounded-md border border-destructive/30 p-4 space-y-3'>
						<div className='font-medium text-destructive flex items-center gap-2'>
							<ShieldAlertIcon size={16} />
							Danger zone
						</div>
						<div className='text-xs text-muted-foreground'>
							Type `DELETE` to enable account deletion button.
							This is UI only for now.
						</div>
						<Input
							value={deleteConfirm}
							onChange={(e) => setDeleteConfirm(e.target.value)}
							placeholder='Type DELETE'
						/>
						<Button
							variant='destructive'
							disabled={deleteConfirm !== 'DELETE'}
							onClick={handleDeleteAccount}>
							<FlameIcon />
							Delete account
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
