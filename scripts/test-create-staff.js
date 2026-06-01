async function run() {
  try {
    const suffix = Date.now().toString(36)
    const res = await fetch('http://localhost:8787/api/create-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test+${suffix}@local`,
        password: 'TestPass123!',
        full_name: `API Test ${suffix}`,
        role: 'staff',
      }),
    })
    const text = await res.text()
    console.log('status', res.status)
    console.log('body', text)
  } catch (e) {
    console.error('err', e)
  }
}

run()
