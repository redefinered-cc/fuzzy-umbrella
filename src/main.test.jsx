import { describe, expect, it, vi } from 'vitest'
import { StrictMode } from 'react'

describe('main entrypoint', () => {
  it('mounts the app into #root', async () => {
    const renderSpy = vi.fn()
    const createRootSpy = vi.fn(() => ({ render: renderSpy }))

    vi.doMock('react-dom/client', () => ({
      createRoot: createRootSpy,
    }))
    vi.doMock('./App.jsx', () => ({
      default: () => <div>Mock App</div>,
    }))

    document.body.innerHTML = '<div id="root"></div>'

    await import('./main.jsx')

    expect(createRootSpy).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderSpy).toHaveBeenCalledTimes(1)
    expect(renderSpy.mock.calls[0][0].type).toBe(StrictMode)

    vi.resetModules()
    vi.doUnmock('react-dom/client')
    vi.doUnmock('./App.jsx')
  })
})
