npm run build
rsync -r deploy/nginx.prod.conf root@1.14.76.82:/data/tdesign_react
echo "上传nginx配置到国内服务器成功"
rsync -r dist root@118.122.74.189:/mydata/human_resources/hr_mobile_ui/
echo "上传dist到线上服务器成功"
