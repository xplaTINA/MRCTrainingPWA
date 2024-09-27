from pywebpush import webpush, WebPushException
import json
import boto3
from flask import Flask, request, jsonify

app = Flask(__name__)

# 関数の例
def get_data_with_api_key():
    dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-1')
    table = dynamodb.Table('PWAMessage')
    response = table.scan()
    #query(
    #KeyConditionExpression=boto3.dynamodb.conditions.Key('conversationID').eq(user_id)
    #)
    items = response1.get('Items', [])
    print(items)
    return items

# APIエンドポイント
@app.route('/getdata', methods=['GET'])
def get_data():
    data = get_data_with_api_key()
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


# DynamoDBリソースに接続
dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-1')

# テーブルを指定
table1 = dynamodb.Table('web-push-notification')
table2 = dynamodb.Table('PWAMessage')

# スキャンを実行してすべてのデータを取得
response1 = table1.scan()
response2 = table2.scan()

#query(
#KeyConditionExpression=boto3.dynamodb.conditions.Key('conversationID').eq(user_id)
#)

# 取得したアイテムを表示
items1 = response1.get('Items', [])
items2 = response2.get('Items', [])
print(items1)
print(items2)


# サブスクリプション情報（PWAから取得して保存されたもの）
subscription_info = {
    "endpoint": items1[0]['endpoint'],
    "keys": {
        "p256dh": items1[0]['p256dh'],
        "auth": items[0]['auth']
    }
}

# VAPIDの公開鍵と秘密鍵
vapid_public_key = "BJTWR9XBBeqSrW-q8Tw_5zi3M9pP9MxjoVoeddcCysSfpbuxwoY9VL1qS2PucnQVnw4eRrdtVUGjhZylj331YPA"
vapid_private_key = "JLcdGd78q4jv8_jKu1Y5EQ7JU-fsY1MJ-KvtsD1Lgh0"

# メッセージデータa
payload = json.dumps({
    "title": "Hello from Python!",
    "body": "This is a push notification sent using Python."
})

try:
    webpush(
        subscription_info,
        data=payload,
        vapid_private_key=vapid_private_key,
        vapid_claims={
            "sub": "mailto:example@yourdomain.org",
            "aud": "https://fcm.googleapis.com",
            "exp": 3600
        }
    )
    print("Push notification sent successfully!")
except WebPushException as ex:
    print("Error sending push notification:", repr(ex))
