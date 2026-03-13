'use client'

import { useEffect } from 'react'

import { supabaseClient } from '@/lib/supabase-client'
import { useAuthStore } from '@/stores/auth-store'

export function AuthStoreBootstrap() {
	const initialize = useAuthStore((state) => state.initialize)
	const syncWithSession = useAuthStore((state) => state.syncWithSession)

	useEffect(() => {
		void initialize()

		if (!supabaseClient) return

		const {
			data: { subscription },
		} = supabaseClient.auth.onAuthStateChange((_event, session) => {
			void syncWithSession(session)
		})

		return () => subscription.unsubscribe()
	}, [initialize, syncWithSession])

	return null
}
