npm run build:test
rsync -r deploy/nginx.my.conf wynode@shanghai:/home/wynode/frontend/hr_mobile_ui
echo "上传nginx配置到wynode服务器成功"
rsync -r dist wynode@shanghai:/home/wynode/frontend/hr_mobile_ui
echo "上传dist目录到wynode服务器成功"
