describe('Basic Tests', () => {
  it('should pass a simple test', () => {
    expect(true).toBe(true)
  })

  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle string operations', () => {
    const str = 'Hello World'
    expect(str).toContain('World')
    expect(str.toLowerCase()).toBe('hello world')
  })
})
