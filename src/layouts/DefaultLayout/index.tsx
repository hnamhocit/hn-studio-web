import { ReactNode } from 'react'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Tabs from '../components/Tabs'

const DefaultLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className='h-screen overflow-hidden'>
			<Header />

			<div className='flex h-[calc(100vh-3rem)]'>
				<Sidebar />

				<div className='flex-1 min-w-0'>
					<Tabs />

					<div className='h-[calc(100vh-3rem)] relative'>
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default DefaultLayout
