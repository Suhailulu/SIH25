import React from 'react'

const sections = [
  {
    title: 'What information to preserve',
    items: [
      'Ticket or fare receipt',
      'Journey details (route, service number, date and time)',
      'Vehicle or service number',
      'Witness information',
      'Any relevant evidence, screenshots or photos'
    ]
  },
  {
    title: 'How the complaint process works',
    items: [
      'Report the issue with the facts and evidence you have.',
      'Submit a complaint and track progress through your dashboard.',
      'Authorities review the complaint, request information if needed, and share an update.',
      'You can respond or add more details until a resolution is recorded.'
    ]
  },
  {
    title: 'Where complaints may be escalated',
    items: [
      'Transport operator complaints desk or customer support',
      'Relevant transport authority or regulator',
      'Government grievance mechanisms where applicable',
      'Police or emergency services in safety-related or urgent cases',
      'Consumer grievance or ombuds channels where available'
    ]
  }
]

export default function RightsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Know Your Rights</h2>
        <div className="card border-l-4 border-amber-400 bg-amber-50">
          This information is provided for general awareness and does not constitute legal advice. Applicable rights and procedures may vary depending on the transport service, location, facts of the incident, and applicable laws.
        </div>

        {sections.map((section) => (
          <div key={section.title} className="card">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-700">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
