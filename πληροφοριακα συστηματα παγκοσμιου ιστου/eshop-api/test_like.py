import requests

url = "http://127.0.0.1:5000/like"
headers = {
    "Content-Type": "application/json"
}
data = {
    "id": "682e23a40249df7a0363c624"  # Βάλε εδώ το σωστό _id του προϊόντος σου
}

response = requests.post(url, json=data, headers=headers)

print("Status code:", response.status_code)
print("Response:", response.json())
