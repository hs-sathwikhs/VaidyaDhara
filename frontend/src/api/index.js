import axios from 'axios'

export const api = axios.create({
	baseURL: '/api',
	timeout: 20000,
})

export async function sendChatMessage({ question, language = 'en', location = 'Mysuru' }) {
	const { data } = await api.post('/chat', { question, language, location })
	return data
}

// Example placeholder APIs; you can swap with real endpoints later
export async function fetchHealthTips() {
	// Could be GET /api/tips in future; using static sample for now
	return [
		{ id: 1, title: 'Stay Hydrated', body: 'Drink at least 8 glasses of water daily to maintain hydration.' },
		{ id: 2, title: 'Regular Exercise', body: 'Aim for 30 minutes of moderate physical activity most days.' },
		{ id: 3, title: 'Balanced Diet', body: 'Include fruits, vegetables, lean proteins, and whole grains in meals.' },
	]
}

export const EMERGENCY_CONTACTS = [
	{ id: 1, label: 'Ambulance', number: '102' },
	{ id: 2, label: 'Police', number: '100' },
	{ id: 3, label: 'Fire', number: '101' },
	{ id: 4, label: 'Women Helpline', number: '1091' },
]
