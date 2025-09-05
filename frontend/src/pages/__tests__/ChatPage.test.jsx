import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatPage from '../ChatPage'
import * as api from '../../api'
import { LanguageProvider } from '../../context/LanguageContext'

vi.mock('../../api', () => ({
  sendChatMessage: vi.fn(async () => ({ answer: 'Test response' }))
}))

function renderWithProviders(ui) {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders and sends message', async () => {
    renderWithProviders(<ChatPage />)
    const input = screen.getByLabelText(/type your message/i)
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.submit(input.closest('form'))
    await waitFor(() => expect(api.sendChatMessage).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('Test response')).toBeInTheDocument()
  })
})
