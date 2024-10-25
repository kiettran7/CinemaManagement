import random

import joblib
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Thiết lập cấu hình
BATCH_SIZE = 8

import re
from underthesea import word_tokenize


# Bước 0: Tiền xử lý dữ liệu
def preprocess_text(text):
    # Chuyển về chữ thường
    text = text.lower()

    # Chuyển các từ viết tắt thông dụng thành đầy đủ
    text = re.sub(r'\bko\b|\bk\b|\bkh\b', 'không', text)  # ko, k, kh -> không
    text = re.sub(r'\bdc\b', 'được', text)  # dc -> được
    text = re.sub(r'\bvs\b|\bv\s', 'với', text)  # vs -> với
    text = re.sub(r'\bhp\b', 'hạnh phúc', text)  # hp -> hạnh phúc
    text = re.sub(r'\bck\b', 'chồng', text)  # ck -> chồng
    text = re.sub(r'\bvk\b', 'vợ', text)  # vk -> vợ
    text = re.sub(r'\bny\b', 'người yêu', text)  # ny -> người yêu
    text = re.sub(r'\bqtv\b', 'quản trị viên', text)  # qtv -> quản trị viên
    text = re.sub(r'\bbn\b', 'bạn', text)  # bn -> bạn
    text = re.sub(r'\btrc\b', 'trước', text)  # trc -> trước
    text = re.sub(r'\bsđt\b', 'số điện thoại', text)  # sđt -> số điện thoại
    text = re.sub(r'\bthks\b|\bthanks\b', 'cảm ơn', text)  # thks, thanks -> cảm ơn
    text = re.sub(r'\btks\b', 'cảm ơn', text)  # tks -> cảm ơn
    text = re.sub(r'\badd\b', 'thêm', text)  # add -> thêm
    text = re.sub(r'\bnxn\b', 'nhiệt xẻo', text)  # nxn -> nhiệt xẻo
    text = re.sub(r'\bae\b', 'anh em', text)  # ae -> anh em
    text = re.sub(r'\bex\b', 'người yêu cũ', text)  # ex -> người yêu cũ
    text = re.sub(r'\blm\b', 'làm', text)  # lm -> làm
    text = re.sub(r'\bnxb\b', 'nhà xuất bản', text)  # nxb -> nhà xuất bản
    text = re.sub(r'\bgh\b', 'giỏ hàng', text)  # gh -> giỏ hàng
    text = re.sub(r'\btr\b', 'triệu', text)  # tr -> triệu
    text = re.sub(r'\bns\b', 'nói', text)  # ns -> nói
    text = re.sub(r'\bhb\b', 'happy birthday', text)  # hb -> happy birthday
    text = re.sub(r'\bbth\b', 'bình thường', text)  # bth -> bình thường
    text = re.sub(r'\bđt\b', 'điện thoại', text)  # đt -> điện thoại
    text = re.sub(r'\bmkt\b', 'marketing', text)  # mkt -> marketing
    text = re.sub(r'\bqa\b', 'quality assurance', text)  # qa -> quality assurance
    text = re.sub(r'\bit\b', 'công nghệ thông tin', text)  # it -> công nghệ thông tin
    text = re.sub(r'\btt\b', 'thông tin', text)  # tt -> thông tin
    text = re.sub(r'\bsr\b', 'sorry', text)  # sr -> sorry
    text = re.sub(r'\bcty\b', 'công ty', text)  # cty -> công ty
    text = re.sub(r'\bxl\b', 'xin lỗi', text)  # xl -> xin lỗi
    text = re.sub(r'\bckh\b', 'chị không', text)  # ckh -> chị không
    text = re.sub(r'\bg9\b', 'good night', text)  # g9 -> good night
    text = re.sub(r'\bhnay\b', 'hôm nay', text)  # hnay -> hôm nay
    text = re.sub(r'\bhqua\b', 'hôm qua', text)  # hqua -> hôm qua
    text = re.sub(r'\bms\b', 'mới', text)  # ms -> mới
    text = re.sub(r'\bckh\b', 'chị không', text)  # ckh -> chị không
    text = re.sub(r'\bđc\b', 'được', text)  # đc -> được
    text = re.sub(r'\bcn\b', 'chủ nhật', text)  # cn -> chủ nhật
    text = re.sub(r'\bhtr\b', 'hỗ trợ', text)  # htr -> hỗ trợ
    text = re.sub(r'\bthg\b', 'thằng', text)  # thg -> thằng
    text = re.sub(r'\bms\b', 'mới', text)  # ms -> mới
    text = re.sub(r'\bvkl\b', 'vãi cả lúa', text)  # vkl -> vãi cả lúa
    text = re.sub(r'\bgato\b', 'ghen ăn tức ở', text)  # gato -> ghen ăn tức ở
    text = re.sub(r'\bdkm\b', 'đăng ký mới', text)  # dkm -> đăng ký mới
    text = re.sub(r'\bbm\b', 'bạn mình', text)  # bm -> bạn mình
    text = re.sub(r'\bnch\b', 'nói chuyện', text)  # nch -> nói chuyện
    text = re.sub(r'\bklq\b', 'không liên quan', text)  # klq -> không liên quan
    text = re.sub(r'\bvl\b', 'vãi lúa', text)  # vl -> vãi lúa
    text = re.sub(r'\bđc\b', 'được', text)  # đc -> được
    text = re.sub(r'\bhpbd\b', 'happy birthday', text)  # hpbd -> happy birthday
    text = re.sub(r'\bvch\b', 'vãi chưởng', text)  # vch -> vãi chưởng
    text = re.sub(r'\blol\b', 'laugh out loud', text)  # lol -> laugh out loud
    text = re.sub(r'\bfyi\b', 'for your information', text)  # fyi -> for your information
    text = re.sub(r'\bgr\b', 'group', text)  # gr -> group
    text = re.sub(r'\bplz\b', 'please', text)  # plz -> please
    text = re.sub(r'\brofl\b', 'rolling on the floor laughing', text)  # rofl -> rolling on the floor laughing
    text = re.sub(r'\bwtf\b', 'what the fuck', text)  # wtf -> what the fuck
    text = re.sub(r'\bbff\b', 'best friends forever', text)  # bff -> best friends forever
    text = re.sub(r'\bbtv\b', 'biên tập viên', text)  # btv -> biên tập viên
    text = re.sub(r'\bbtc\b', 'ban tổ chức', text)  # btc -> ban tổ chức
    text = re.sub(r'\bcmnd\b', 'chứng minh nhân dân', text)  # cmnd -> chứng minh nhân dân
    text = re.sub(r'\bcv\b', 'công việc', text)  # cv -> công việc
    text = re.sub(r'\bct\b', 'công ty', text)  # ct -> công ty
    text = re.sub(r'\bcd\b', 'chủ đề', text)  # cd -> chủ đề
    text = re.sub(r'\bpt\b', 'phát triển', text)  # pt -> phát triển
    text = re.sub(r'\bv.v\b|\bvân vân\b', 'vân vân', text)  # v.v -> vân vân

    # Xóa URL
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

    # Xóa địa chỉ email
    text = re.sub(r'\S+@\S+', '', text)

    # Xóa ký tự đặc biệt, giữ lại ký tự tiếng Việt
    text = re.sub(r'[^0-9a-zA-ZÀÁẢÃẠÂẦẨẪÊỀẾỂỄỈỊÓÒỎÕỌÔỒỔỖƠỚỜỞỠỤÙỦŨỴÝỲỶỸĐ]', ' ', text)

    # Xóa khoảng trắng thừa
    text = re.sub(r'\s+', ' ', text).strip()

    # Tokenization
    words = word_tokenize(text, format='text').split()

    # Xóa stopwords tự tạo
    stop_words = {
        'và', 'của', 'có', 'cho', 'với', 'là', 'trong', 'khi', 'được', 'này', 'những', 'một',
        'để', 'các', 'nhiều', 'nên', 'nếu', 'rất', 'bởi', 'gì', 'vậy', 'thì', 'cũng', 'như',
        'không', 'đã', 'chúng', 'tôi', 'nè', 'đó', 'cái', 'thì', 'đang', 'lại', 'hay', 'ra',
        'nào', 'mình', 'đi', 'làm', 'gì', 'ai', 'đâu', 'đấy', 'để', 'tại', 'vì', 'còn', 'khi',
        'nào', 'nhưng', 'sao', 'rồi', 'vừa', 'bao', 'lâu', 'hơn', 'mới', 'thế', 'từ', 'vẫn',
        'được', 'đang', 'nữa', 'là', 'chỉ', 'vẫn', 'chưa', 'tự', 'mọi', 'nhưng', 'dù', 'bạn',
        'hết', 'hôm', 'nay', 'ngày', 'cả', 'nhiều', 'gì', 'đó', 'kia', 'nào', 'vậy', 'thôi',
        'sao', 'rồi', 'vẫn', 'rất', 'ở', 'còn', 'lúc', 'gì', 'bên', 'một', 'mà', 'vẫn', 'thế',
        'rồi', 'giữa', 'bên', 'ai', 'bị', 'cũng', 'đã', 'được', 'cứ', 'do', 'về', 'hết', 'này',
        'với', 'theo', 'trong', 'ngoài', 'rằng', 'bởi', 'thế', 'tại', 'nhiều', 'nói', 'như', 'ra',
        'trên', 'dưới', 'đúng', 'vào', 'gì', 'nên', 'ở', 'vẫn', 'muốn', 'gần', 'mất', 'hơn',
        'càng', 'vậy', 'phải', 'ít', 'quá', 'lại', 'bao', 'có', 'lắm', 'vì', 'ai', 'điều', 'chỉ',
        'đây', 'cùng', 'làm', 'nói', 'giờ', 'cũng', 'khác', 'lần', 'vừa', 'giờ', 'khiến', 'khoảng',
        'biết', 'thật', 'họ', 'thành', 'giữa', 'nào', 'bạn', 'lại', 'vậy', 'ai', 'phải', 'mình',
        'như', 'thấy', 'vẫn', 'mỗi', 'từng', 'nào', 'trước', 'khi', 'nếu', 'nơi', 'nào', 'bao',
        'ngay', 'chỉ', 'lúc', 'bây', 'giờ', 'phải', 'nữa', 'chính', 'vậy', 'kia', 'lúc', 'muốn'
    }
    words = [word for word in words if word not in stop_words]

    # Xóa từ quá ngắn hoặc quá dài
    words = [word for word in words if 2 < len(word) < 15]

    # Xóa từ chỉ chứa số hoặc ký tự đặc biệt
    words = [word for word in words if re.match(r'^[\wÀÁẢÃẠÂẦẨẪÊỀẾỂỄỊÓÒỎÕỌÔỒỔỖƠỚỜỞỠỤÙỦŨỤÝỲÝỸĐ]+$', word)]

    # Xóa từ có nhiều ký tự lặp lại liên tiếp
    words = [word for word in words if not re.search(r'(.)\1{2,}', word)]

    return ' '.join(words)

# Đọc dữ liệu
data = pd.read_csv('dataset/train.csv', usecols=['Comment', 'Label'])
data['Label'] = data['Label'].astype(int)

# Áp dụng tiền xử lý cho tất cả các bình luận
data['Comment'] = data['Comment'].apply(preprocess_text)

# Bước 1: Chia dữ liệu thành tập huấn luyện và tập kiểm tra
X_train, X_test, y_train, y_test = train_test_split(data['Comment'], data['Label'], test_size=0.2, random_state=42)

# Bước 2: Chuyển đổi văn bản thành vector số
vectorizer = TfidfVectorizer(max_features=50000)
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Bước 3: Tạo mô hình Logistic Regression
model = LogisticRegression(max_iter=10000)
model.fit(X_train_vectorized, y_train)

# Bước 4: Lưu mô hình và vectorizer
joblib.dump(model, 'logistic_regression_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
#sentence transformer
# Tạo Flask app
app = Flask(__name__)

# Hàm dự đoán spam
def predict_spam(comment):
    comment_vectorized = vectorizer.transform([comment])
    prediction = model.predict(comment_vectorized)
    return prediction[0]

# Hàm tạo phản hồi ngẫu nhiên
def get_random_response(spam_label):
    responses = {
        0: [
            "Cảm ơn bạn đã phản hồi!",
            "Chúng tôi rất trân trọng ý kiến của bạn!",
            "Phản hồi của bạn đã được ghi nhận, cảm ơn nhiều!",
            "Chúng tôi đánh giá cao sự đóng góp của bạn!",
            "Chân thành cảm ơn bạn vì đã dành thời gian chia sẻ với chúng tôi!",
            "Chúng tôi sẽ sử dụng ý kiến này để cải thiện dịch vụ!",
            "Cảm ơn, mọi phản hồi đều quý giá với chúng tôi!"
        ],
        1: [
            "Chúng tôi sẽ xem xét vấn đề này!",
            "Cảm ơn đã thông báo!",
            "Phản hồi của bạn đã được gửi, chúng tôi sẽ kiểm tra ngay!",
            "Vấn đề này sẽ được chúng tôi giải quyết sớm!",
            "Cảm ơn bạn đã cảnh báo, chúng tôi sẽ xử lý!",
            "Chúng tôi đã nhận được thông tin và đang trong quá trình kiểm tra!",
            "Cảm ơn, nhóm của chúng tôi đang xem xét vấn đề này!"
        ],
    }
    return random.choice(responses[spam_label])

# API endpoint cho phân loại spam (method POST - "/spam" - {content: ...})
@app.route('/spam', methods=['POST'])
def spam_analysis():
    content = request.json.get('content', '')
    if content.strip() == '':
        return jsonify({"error": "Không có nội dung được cung cấp"}), 400

    if not isinstance(content, str):
        content = str(content)

    processed_content = preprocess_text(content)
    spam_label = predict_spam(processed_content)
    model_response = get_random_response(spam_label)

    response = {
        "spam": int(spam_label),
        "modelResponse": model_response
    }
    return jsonify(response)

# Khởi động Flask app
if __name__ == '__main__':
    app.run(debug=True)