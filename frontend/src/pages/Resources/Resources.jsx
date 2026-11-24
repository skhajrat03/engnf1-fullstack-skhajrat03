
import Layout from '../../components/Layout/Layout'
import './Resources.css'

const resources = [
  { id: 1, name: 'Conference Room A', type: 'Meeting Room', location: 'Block A', capacity: 12, status: 'Available' },
  { id: 2, name: 'Computer Lab 1', type: 'Laboratory', location: 'Block B', capacity: 30, status: 'Available' },
  { id: 3, name: 'Projector', type: 'Equipment', location: 'Block C', capacity: 1, status: 'Unavailable' },
]

function Resources() {
  return (
    <Layout title="Resources">
      <div className="resources-page">
        <div className="resources-heading">
          <h1>Resource Directory</h1>
          <p>Find rooms, laboratories and equipment.</p>
        </div>

        <div className="resource-grid">
          {resources.map((resource) => (
            <div className="resource-card" key={resource.id}>
              <div className="resource-icon">▣</div>

              <h3>{resource.name}</h3>
              <p>{resource.type}</p>

              <div className="resource-meta">
                <span>{resource.location}</span>
                <span>Capacity: {resource.capacity}</span>
              </div>

              <span className={`resource-status ${resource.status.toLowerCase()}`}>
                {resource.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Resources
