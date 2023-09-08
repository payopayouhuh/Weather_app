# ベースイメージ
FROM node:14

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係のファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# その他のソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

CMD ["npm", "start"]
