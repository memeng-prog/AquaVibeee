async function run() {
  const userId = process.argv[2]

  if (!userId) {
    console.error('Usage: node scripts/test-delete-user.js <userId>')
    process.exit(1)
  }

  try {
    const res = await fetch('http://localhost:8787/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId }),
    })

    const text = await res.text()
    console.log('status', res.status)
    console.log('body', text)
  } catch (error) {
    console.error('err', error)
    process.exitCode = 1
  }
}

run()