'use client'

import { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

import { supabaseClient } from '@/lib/supabase-client'

export type ProfileUser = {
	id: string
	email?: string | null
	[key: string]: unknown
}

type AuthStatus = 'idle' | 'loading' | 'ready'

interface AuthState {
	status: AuthStatus
	session: Session | null
	authUser: User | null
	profileUser: ProfileUser | null
	error: string | null
	initialize: () => Promise<void>
	syncWithSession: (session: Session | null) => Promise<void>
	refreshProfile: () => Promise<void>
	clearError: () => void
}

async function fetchProfileByAuthId(
	authId: string,
): Promise<{ data: ProfileUser | null; error: string | null }> {
	if (!supabaseClient) {
		return { data: null, error: null }
	}

	const { data, error } = await supabaseClient
		.from('users')
		.select('*')
		.eq('id', authId)
		.maybeSingle()

	if (!error) {
		return { data: (data as ProfileUser | null) ?? null, error: null }
	}

	// `maybeSingle` may return not-found as an error in some PostgREST versions.
	if (error.code === 'PGRST116') {
		return { data: null, error: null }
	}

	return { data: null, error: error.message }
}

export const useAuthStore = create<AuthState>((set, get) => ({
	status: 'idle',
	session: null,
	authUser: null,
	profileUser: null,
	error: null,

	initialize: async () => {
		if (!supabaseClient) {
			set({
				status: 'ready',
				session: null,
				authUser: null,
				profileUser: null,
				error: null,
			})
			return
		}

		set({ status: 'loading', error: null })

		const { data, error } = await supabaseClient.auth.getSession()
		if (error) {
			set({
				status: 'ready',
				session: null,
				authUser: null,
				profileUser: null,
				error: error.message,
			})
			return
		}

		await get().syncWithSession(data.session)
	},

	syncWithSession: async (session) => {
		const authUser = session?.user ?? null

		set({
			status: 'loading',
			session,
			authUser,
			error: null,
		})

		if (!authUser) {
			// No authenticated user: keep app on current page, do not redirect.
			set({
				status: 'ready',
				profileUser: null,
			})
			return
		}

		const { data, error } = await fetchProfileByAuthId(authUser.id)
		set({
			status: 'ready',
			profileUser: data,
			error,
		})
	},

	refreshProfile: async () => {
		const authId = get().authUser?.id
		if (!authId) {
			set({ profileUser: null, error: null })
			return
		}

		const { data, error } = await fetchProfileByAuthId(authId)
		set({
			profileUser: data,
			error,
		})
	},

	clearError: () => set({ error: null }),
}))
