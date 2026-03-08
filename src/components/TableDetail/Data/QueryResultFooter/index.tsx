import { CheckCircle2Icon, HardDriveIcon, KeyboardIcon } from 'lucide-react'

import { IQueryResult } from '@/interfaces'
import { formatDataSize } from '@/utils'

interface QueryResultFooterProps {
	result: IQueryResult
}

const QueryResultFooter = ({ result }: QueryResultFooterProps) => {
	return (
		<div className='shrink-0 p-4 flex items-center justify-between border-t bg-neutral-50 dark:bg-neutral-900'>
			<div className='flex items-center gap-2'>
				<CheckCircle2Icon
					className='text-green-600'
					size={18}
				/>

				<div className='text-sm text-neutral-600 dark:text-neutral-300'>
					<span className='font-semibold'>{result.rows?.length}</span>{' '}
					rows affected in{' '}
					<span className='font-semibold'>
						{result.durationMs?.toFixed(2)}
					</span>{' '}
					ms
				</div>
			</div>

			<div className='flex items-center gap-4'>
				<div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300'>
					<HardDriveIcon />
					<span>Memory: {formatDataSize(result.sizeBytes || 0)}</span>
				</div>

				<div className='w-0.5 h-8 bg-neutral-600 dark:bg-neutral-700' />

				<div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300'>
					<KeyboardIcon />
					<span>UTF8</span>
				</div>
			</div>
		</div>
	)
}

export default QueryResultFooter
