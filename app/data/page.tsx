async function getData() {
    const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/users', {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
  }
  
  export default async function DataPage() {
    const data = await getData()
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Data ({data.length} users)</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Current Step</th>
                <th className="px-6 py-3 border-b">About Me</th>
                <th className="px-6 py-3 border-b">Address</th>
                <th className="px-6 py-3 border-b">Birthdate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b">{user.current_step}</td>
                  <td className="px-6 py-4 border-b">{user.about_me || '-'}</td>
                  <td className="px-6 py-4 border-b">
                    {user.street_address ? 
                      `${user.street_address}, ${user.city}, ${user.state} ${user.zip}` 
                      : '-'}
                  </td>
                  <td className="px-6 py-4 border-b">{user.birthdate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }