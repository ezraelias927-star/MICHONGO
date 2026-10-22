import requests

session_client = requests.Session()
base_url = "http://127.0.0.1:5000"
headers = {"Content-Type": "application/json"}

# --- HATUA YA 1: Ingia kwenye akaunti kwanza kupata session ---
login_url = f"{base_url}/login"
login_payload = {
    "identifier": (
        "ezra2026@michongo.co.tz"  # Weka email au username yako halisi
    ),
    "password": "Password123@",  # Weka password yako halisi
}

print("1. Inajaribu ku-log in kupata session...")
login_response = session_client.post(
    login_url, json=login_payload, headers=headers
)
print("Login Status Code:", login_response.status_code)

try:
  print("Login Response:", login_response.json())
except Exception:
  print("Login Response Text:", login_response.text)

# --- HATUA YA 2 & 3: Ikiwa login imekubali, jaribu kuweka comment na kusoma maoni ---
if login_response.status_code == 200:

  # 2. Tuma Comment Mpya
  comment_url = f"{base_url}/comments/create"
  comment_payload = {
      "post_id": 1,  # Hakikisha post yenye ID hii ipo kwenye database yako
      "content": (
          "Mchongo uko vizuri sana! Hii ni test ya comment kupitia Python"
          " script."
      ),
      # "parent_id": None  # Weka ID ya comment nyingine hapa kama unataka kujaribu kujibu (reply)
  }

  print("\n2. Inatuma comment mpya kwenye post...")
  comment_response = session_client.post(
      comment_url, json=comment_payload, headers=headers
  )
  print(f"Comment Status Code: {comment_response.status_code}")
  print("Comment Response JSON:")
  print(comment_response.json())

  # 3. Vuta Maoni Yote ya Hiyo Post (GET)
  get_comments_url = f"{base_url}/posts/1/comments"
  print(f"\n3. Inavuta orodha yote ya maoni ya post ID 1...")
  get_response = session_client.get(get_comments_url, headers=headers)

  print(f"Get Comments Status Code: {get_response.status_code}")
  print("Comments List JSON:")
  print(get_response.json())

else:
  print("\n⚠️ Login haikufaulu, hatuwezi kuendelea na test ya maoni.")