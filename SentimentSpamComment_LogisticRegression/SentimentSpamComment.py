import random

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify
import joblib  # Để lưu mô hình

# Thiết lập cấu hình
BATCH_SIZE = 8  # Kích thước batch không cần thiết ở đây

# Đọc dữ liệu
data = pd.read_csv('dataset/train.csv', usecols=['Comment', 'Label'])
data['Label'] = data['Label'].astype(int)

# Bước 1: Chia dữ liệu thành tập huấn luyện và tập kiểm tra
X_train, X_test, y_train, y_test = train_test_split(data['Comment'], data['Label'], test_size=0.2, random_state=42)

# Bước 2: Chuyển đổi văn bản thành vector số
vectorizer = TfidfVectorizer(max_features=50000)  # Giới hạn số lượng từ trong vector
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Bước 3: Tạo mô hình Logistic Regression
model = LogisticRegression(max_iter=10000)  # Có thể điều chỉnh max_iter nếu cần
model.fit(X_train_vectorized, y_train)

# Bước 4: Lưu mô hình và vectorizer
joblib.dump(model, 'logistic_regression_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')

# Tạo Flask app
app = Flask(__name__)

# Hàm dự đoán spam
def predict_spam(comment):
    # Chuyển đổi bình luận thành vector
    comment_vectorized = vectorizer.transform([comment])
    prediction = model.predict(comment_vectorized)
    return prediction[0]

# Hàm tạo phản hồi ngẫu nhiên
def get_random_response(spam_label):
    responses = {
        0: ["Cảm ơn bạn đã phản hồi!", "Chúng tôi rất trân trọng ý kiến của bạn!"],
        1: ["Chúng tôi sẽ xem xét vấn đề này!", "Cảm ơn đã thông báo!"],
    }
    return random.choice(responses[spam_label])

# API endpoint cho phân loại spam
@app.route('/spam', methods=['POST'])
def spam_analysis():
    content = request.json.get('content', '')
    if content.strip() == '':
        return jsonify({"error": "Không có nội dung được cung cấp"}), 400

    # Chuyển đổi content thành string nếu cần
    if not isinstance(content, str):
        content = str(content)

    spam_label = predict_spam(content)
    model_response = get_random_response(spam_label)

    # Convert any non-serializable types to Python native types
    response = {
        "spam": int(spam_label),  # Convert to regular int
        "modelResponse": model_response
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)