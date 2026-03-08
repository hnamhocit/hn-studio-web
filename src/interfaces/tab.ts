export type TabType = 'query' | 'detail' | 'sql-file'

export interface ITab {
	id: string
	type: TabType
	title: string

	dataSourceId: string | null
	database: string | null
	table: string | null
}
