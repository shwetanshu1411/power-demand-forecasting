function HolidayTable({ holidays }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Localized Holidays</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-2">Date</th>
              <th className="p-2">Holiday</th>
              <th className="p-2">Type</th>
            </tr>
          </thead>

          <tbody>
            {holidays.map((holiday) => (
              <tr key={`${holiday.date}-${holiday.name}`} className="border-b">
                <td className="p-2">{holiday.date}</td>
                <td className="p-2">{holiday.name}</td>
                <td className="p-2 capitalize">{holiday.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HolidayTable;