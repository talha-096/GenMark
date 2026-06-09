import json
import time

def test_settings_endpoints(client):
    # 1. Register a test user to get JWT token
    unique_email = f"test_settings_{int(time.time())}@example.com"
    reg_response = client.post('/api/auth/register', json={
        "name": "Settings Tester",
        "email": unique_email,
        "password": "settingspassword123"
    })
    assert reg_response.status_code == 201
    reg_data = json.loads(reg_response.data)
    token = reg_data['token']
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # 2. Test GET default settings fallback
    get_response = client.get('/api/settings/', headers=headers)
    assert get_response.status_code == 200
    settings = json.loads(get_response.data)
    assert settings['name'] == "Settings Tester"
    assert settings['email'] == unique_email
    assert settings['preferences']['theme'] == "dark"
    assert settings['preferences']['email_notifications']['content_ready'] is True

    # 3. Test PUT updates profile name and email successfully
    new_email = f"updated_{int(time.time())}@example.com"
    profile_payload = {
        "name": "Updated Tester Name",
        "email": new_email
    }
    profile_response = client.put('/api/settings/profile', json=profile_payload, headers=headers)
    assert profile_response.status_code == 200
    res_data = json.loads(profile_response.data)
    assert res_data['name'] == "Updated Tester Name"
    assert res_data['email'] == new_email

    # 4. Test PUT profile validations (invalid email structure)
    invalid_profile = {
        "name": "Tester Name",
        "email": "invalid-email-format"
    }
    invalid_response = client.put('/api/settings/profile', json=invalid_profile, headers=headers)
    assert invalid_response.status_code == 400

    # 5. Test PUT updates preferences theme and notifications
    pref_payload = {
        "theme": "light",
        "email_notifications": {
            "content_ready": False,
            "weekly_summary": True,
            "system_updates": False
        }
    }
    pref_response = client.put('/api/settings/preferences', json=pref_payload, headers=headers)
    assert pref_response.status_code == 200
    pref_data = json.loads(pref_response.data)
    assert pref_data['preferences']['theme'] == "light"
    assert pref_data['preferences']['email_notifications']['content_ready'] is False
    assert pref_data['preferences']['email_notifications']['weekly_summary'] is True
    assert pref_data['preferences']['email_notifications']['system_updates'] is False

    # 6. Test PUT changes password securely
    password_payload = {
        "current_password": "settingspassword123",
        "new_password": "newsecurepassword456"
    }
    pass_response = client.put('/api/settings/password', json=password_payload, headers=headers)
    assert pass_response.status_code == 200

    # 7. Test PUT changes password with incorrect current password
    incorrect_password_payload = {
        "current_password": "wrongcurrentpassword",
        "new_password": "newsecurepassword789"
    }
    pass_response_fail = client.put('/api/settings/password', json=incorrect_password_payload, headers=headers)
    assert pass_response_fail.status_code == 401
