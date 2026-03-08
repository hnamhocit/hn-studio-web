'use client'

import { BellIcon, MoonIcon, SunIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores'

const Header = () => {
	const { user } = useUserStore()
	const [isDarkMode, setIsDarkMode] = useState(false)

	const toggleIsDarkMode = () => setIsDarkMode((prev) => !prev)

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	return (
		<div className='h-12 border-b flex items-center justify-between px-4'>
			<div className='flex items-center gap-4'>
				<Image
					src='/logo.png'
					alt='Logo'
					width={32}
					height={32}
					className='object-fit rounded-full'
				/>

				<div className='text-xl font-bold'>HN Studio</div>
			</div>

			<div className='flex items-center gap-4'>
				<Input
					type='text'
					placeholder='Search...'
					className='hidden md:block'
				/>

				<Button
					size='icon'
					variant='outline'>
					<BellIcon />
				</Button>

				<Button
					size='icon'
					variant='outline'
					onClick={toggleIsDarkMode}>
					{isDarkMode ?
						<MoonIcon />
					:	<SunIcon />}
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage
								src={user?.photo_url || '/default-user.jpg'}
							/>
							<AvatarFallback>
								{user?.name?.substring(0, 2).toUpperCase() ||
									'U'}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}

export default Header
