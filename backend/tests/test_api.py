from app.core.config import settings

def test_health_and_archive(client):
    assert client.get("/health").status_code == 200
    overview = client.get("/api/v1/archive/overview").json()
    assert overview["counts"]["gharanas"] >= 4
    assert overview["counts"]["taals"] >= 6

def test_search_and_auth_workflow(client):
    search_res = client.get("/api/v1/search?q=Teentaal").json()
    assert search_res["total"] >= 1
    reg = client.post("/api/v1/auth/register", json={"email": "meera@example.com", "password": "StrongPassword123!", "full_name": "Meera Nair"})
    assert reg.status_code == 201
    headers = {"Authorization": f"Bearer {reg.json()['access_token']}"}
    assert client.post("/api/v1/bookmarks", headers=headers, json={"entity_type": "gharana", "entity_id": 1, "entity_title": "Lucknow Gharana", "entity_url": "/gharanas/lucknow-gharana"}).status_code == 201
    sub = client.post("/api/v1/community/submissions", headers=headers, json={"submission_type": "article", "title": "Vilambit Laya Study Note", "summary": "Notes on posture in slow tempo Thaat.", "content_body": "Vilambit laya in Thaat requires sustained core poise, unhurried wrist circles, and steady eye focus.", "source_references": "Kathak Kendra introductory notes", "rights_confirmed": True})
    assert sub.status_code == 201
    sub_id = sub.json()["id"]
    assert client.get("/api/v1/admin/stats", headers=headers).status_code == 403
    admin_login = client.post("/api/v1/auth/login", json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD})
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}
    approve = client.put(f"/api/v1/admin/submissions/{sub_id}", headers=admin_headers, json={"status": "approved", "reviewer_notes": "Approved."})
    assert approve.status_code == 200 and approve.json()["status"] == "approved"
