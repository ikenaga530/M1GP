import random
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def generate_random_numbers(count):
    numbers = random.sample(range(1, 101), count)
    return numbers


def get_document_id(name):
    collection_name = name

    collection_ref = db.collection(collection_name)
    documents = collection_ref.get()

    # ドキュメントIDを格納するリストを初期化
    document_ids = []

    # 各ドキュメントのIDを取得してリストに追加
    for doc in documents:
        document_ids.append(doc.id)

    return document_ids


def update_data():
    collection_ref = db.collection('sight')
    documents = collection_ref.get()
    count = len(documents)

    random_num = generate_random_numbers(count)

    documents_id_list = get_document_id('sight')

    for i, docs in enumerate(documents_id_list):
        if 0 <= random_num[i] <= 25:
            ysmt = "t"
        elif 26 <= random_num[i] <= 50:
            ysmt = "m"
        elif 51 <= random_num[i] <= 75:
            ysmt = "s"
        else:
            ysmt = "y"

        new_data = {
            'crowd': random_num[i],
            'ysmt': ysmt
        }

        document_ref = db.collection('sight').document(docs)
        document_ref.update({'crowd': random_num[i]})
        document_ref.update({'ysmt': ysmt})
    print("実行")


# Firebaseの初期化
cred = credentials.Certificate("./m1gp-firebase.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# メインループ
while True:
    update_data()
    time.sleep(30)  # 30秒間スリープ
