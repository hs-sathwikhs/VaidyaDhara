import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'
import Footer from '../Footer'
import { LanguageProvider } from '../../context/LanguageContext'

function renderAll() {
  render(
    <LanguageProvider>
      <Header />
      <Footer />
    </LanguageProvider>
  )
}

describe('Header & Footer', () => {
  it('renders app name and disclaimer', () => {
    renderAll()
    expect(screen.getByText(/Vaidya Dhara/i)).toBeInTheDocument()
    expect(screen.getByText(/not a substitute for professional medical advice/i)).toBeInTheDocument()
  })
})
