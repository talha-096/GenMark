import json

def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data
    # We expect healthy or degraded depending on DB connection in CI
    assert data['status'] in ['healthy', 'degraded']
