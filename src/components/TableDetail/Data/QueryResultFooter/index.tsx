import { CheckCircle2Icon, HardDriveIcon, KeyboardIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { IQueryResult } from '@/interfaces'
import { formatDataSize } from '@/utils'

interface QueryResultFooterProps {
	result: IQueryResult
}

const fadeUp = {
	initial: { opacity: 0, y: 6 },
	animate: { opacity: 1, y: 0 },
}

const QueryResultFooter = ({ result }: QueryResultFooterProps) => {
	return (
		<motion.div
			className='shrink-0 p-4 flex items-center justify-between border-t bg-neutral-50 dark:bg-neutral-900'
			initial='initial'
			animate='animate'
			variants={{
				initial: {},
				animate: {
					transition: {
						staggerChildren: 0.06,
					},
				},
			}}>
			<motion.div
				className='flex items-center gap-2'
				variants={fadeUp}
				transition={{ duration: 0.2, ease: 'easeOut' }}>
				<motion.div
					initial={{ scale: 0.96, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.18, ease: 'easeOut' }}>
					<CheckCircle2Icon
						className='text-green-600'
						size={18}
					/>
				</motion.div>

				<div className='text-sm text-neutral-600 dark:text-neutral-300'>
					<span className='font-semibold'>{result.rows?.length}</span>{' '}
					rows affected in{' '}
					<span className='font-semibold'>
						{result.durationMs?.toFixed(2)}
					</span>{' '}
					ms
				</div>
			</motion.div>

			<motion.div
				className='flex items-center gap-4'
				variants={fadeUp}
				transition={{ duration: 0.2, ease: 'easeOut', delay: 0.04 }}>
				<motion.div
					className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300'
					whileHover={{ scale: 1.02 }}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 22,
					}}>
					<HardDriveIcon size={16} />
					<span>Memory: {formatDataSize(result.sizeBytes || 0)}</span>
				</motion.div>

				<div className='w-0.5 h-8 bg-neutral-600 dark:bg-neutral-700' />

				<motion.div
					className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300'
					whileHover={{ scale: 1.02 }}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 22,
					}}>
					<KeyboardIcon size={16} />
					<span>UTF8</span>
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

export default QueryResultFooter
