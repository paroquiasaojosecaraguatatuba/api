import {logWithConsole} from './console'
import {logWithDiscord} from './discord'

export const log = async (params: {
	data: object
	env: Bindings
	error?: unknown
}) => {
	switch (params.env.ENVIRONMENT) {
		case 'development': {
			return await logWithConsole(params)
		}
		default: {
			return await logWithDiscord(params)
		}
	}
}