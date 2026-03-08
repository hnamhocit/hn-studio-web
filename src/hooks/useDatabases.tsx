import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { dataSourcesService } from '@/services'
import { useDataSourcesStore } from '@/stores'
import { notifyError } from '@/utils'

export const useDatabases = (dataSourceId: string) => {
	const [isLoading, setIsLoading] = useState(false)
	const inFlightRef = useRef(false)

	const { cachedDatabases, datasources, setCachedDatabases } =
		useDataSourcesStore()

	const cached = cachedDatabases[dataSourceId]

	const showAllDatabases = useMemo(() => {
		return (
			datasources.find((ds) => ds.id === dataSourceId)?.config
				?.showAllDatabases || false
		)
	}, [datasources, dataSourceId])

	const databases = cached ?? []

	const fetchDatabases = useCallback(
		async (forceReload = false) => {
			if (!forceReload && cached) return
			if (inFlightRef.current) return

			inFlightRef.current = true
			setIsLoading(true)

			try {
				const { data } = await dataSourcesService.getDatabases(
					dataSourceId,
					showAllDatabases,
				)

				setCachedDatabases(dataSourceId, data.data ?? [])
			} catch (error) {
				notifyError(error, 'Failed to fetch databases.')
			} finally {
				inFlightRef.current = false
				setIsLoading(false)
			}
		},
		[dataSourceId, showAllDatabases, cached, setCachedDatabases],
	)

	useEffect(() => {
		void fetchDatabases()
	}, [fetchDatabases])

	const reload = useCallback(async () => {
		await fetchDatabases(true)
	}, [fetchDatabases])

	return { databases, isLoading, reload }
}
