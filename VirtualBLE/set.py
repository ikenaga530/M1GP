import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Firebase Admin SDKの初期化
# サービスアカウントキーのパスを指定してください
cred = credentials.Certificate("./m1gp-firebase.json")
firebase_admin.initialize_app(cred)

# Firestoreクライアントの取得
db = firestore.client()

# データのセット


def set_data(collection_name, data):
    for item in data:
        doc_ref = db.collection(collection_name).document()  # ランダムなドキュメントIDを生成
        doc_ref.set(item)


# データのセット実行
collection_name = "sight"  # コレクション名を指定してください
data = [
    {'lat': 34.68507309557777, 'lon': 135.84299797844545,
        'crowd': 1, 'place': '奈良公園', 'ysmt': ''},
    {'lat': 34.69181905503654, 'lon': 135.8546490296763,
        'crowd': 1, 'place': '若草山', 'ysmt': ''},
    {'lat': 34.53700799029658, 'lon': 135.90666026594374,
        'crowd': 1, 'place': '長谷寺', 'ysmt': ''},
    {'lat': 34.44717996600673, 'lon': 135.71205711799638,
        'crowd': 1, 'place': '葛城一言主神社', 'ysmt': ''},
    {'lat': 34.46254464909211, 'lon': 135.80616279665628,
        'crowd': 1, 'place': '高松塚古墳', 'ysmt': ''},
    {'lat': 34.528959747282315, 'lon': 135.85326470799464,
        'crowd': 1, 'place': '大神神社', 'ysmt': ''},
    {'lat': 34.46697176438159, 'lon': 135.82614246804187,
        'crowd': 1, 'place': '石舞台古墳', 'ysmt': ''},
    {'lat': 34.675608882629106, 'lon': 135.78486729911788,
        'crowd': 1, 'place': '唐招提寺', 'ysmt': ''},
    {'lat': 34.6813988077721, 'lon': 135.84840123194866,
        'crowd': 1, 'place': '春日大社', 'ysmt': ''},
    {'lat': 34.68612108161065, 'lon': 135.8371770868421,
        'crowd': 1, 'place': '依水園・寧楽美術館', 'ysmt': ''},
    {'lat': 34.69086886226662, 'lon': 135.79421672393138,
        'crowd': 1, 'place': '平城宮跡歴史公園', 'ysmt': ''},
    {'lat': 34.68593896205072, 'lon': 135.8324922721187,
        'crowd': 1, 'place': '奈良県立美術館', 'ysmt': ''},
    {'lat': 34.68592640282977, 'lon': 135.83985002600292,
        'crowd': 1, 'place': '東大寺南大門', 'ysmt': ''},
    {'lat': 34.68455342972165, 'lon': 135.83782330651002,
        'crowd': 1, 'place': '氷室神社', 'ysmt': ''},
    {'lat': 34.683164592291774, 'lon': 135.83852391000244,
        'crowd': 1, 'place': '奈良国立博物館', 'ysmt': ''},
    {'lat': 34.59782857749049, 'lon': 135.85209108344662,
        'crowd': 1, 'place': '石上神宮', 'ysmt': ''},
    {'lat': 34.61427209453812, 'lon': 135.73565036328208,
        'crowd': 1, 'place': '法隆寺', 'ysmt': ''},
    {'lat': 34.68021372331244, 'lon': 135.8386719834495,
        'crowd': 1, 'place': '浮見堂', 'ysmt': ''},
    {'lat': 34.4886050356433, 'lon': 135.7863335104302,
        'crowd': 1, 'place': '橿原神宮', 'ysmt': ''},
    {'lat': 34.69187256632611, 'lon': 135.8385678329684,
        'crowd': 1, 'place': '正倉院正倉', 'ysmt': ''},
    {'lat': 34.688934035061536, 'lon': 135.8397880356628,
        'crowd': 1, 'place': '東大寺', 'ysmt': ''},
    {'lat': 34.46572179469204, 'lon': 135.8616239573109,
        'crowd': 1, 'place': '談山神社', 'ysmt': ''},
    {'lat': 34.677858354995124, 'lon': 135.83123803981871,
        'crowd': 1, 'place': '元興寺', 'ysmt': ''},
    {'lat': 34.687017146288945, 'lon': 135.79428305725224,
        'crowd': 1, 'place': '朱雀門', 'ysmt': ''},
    {'lat': 34.45120690446315, 'lon': 135.80524234932568,
        'crowd': 1, 'place': 'キトラ古墳', 'ysmt': ''},
    {'lat': 34.68291944350474, 'lon': 135.8322305858669,
        'crowd': 1, 'place': '興福寺', 'ysmt': ''},
    {'lat': 34.689480007061455, 'lon': 135.84424439256247,
        'crowd': 1, 'place': '東大寺二月堂', 'ysmt': ''},
    {'lat': 34.68249974356691, 'lon': 135.8441892733733,
        'crowd': 1, 'place': '萬葉植物園', 'ysmt': ''},
]

set_data(collection_name, data)
