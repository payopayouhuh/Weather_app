# ベースイメージ
FROM python:3.8

# システムパッケージをアップデート & 必要なものをインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係のファイルをコピー
RUN pip install --upgrade pip
RUN pip install Cython
RUN pip install numpy==1.16.4

RUN pip install numpy==1.16.4
RUN pip install flask==2.1.1
RUN pip install requests==2.22.0
RUN pip install matplotlib==3.1.0
RUN pip install pytz==2019.1
RUN pip install flask-cors==4.0.0

RUN pip install pandas==1.3.3


#COPY requirements.txt .
#RUN pip install --no-cache-dir -r requirements.txt

# その他のソースコードをコピー
COPY . .

# デフォルトのコマンドを設定
CMD ["python", "app.py"]
