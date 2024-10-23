npm run build
rsync -r dist root@118.122.74.189:/mydata/human_resources/hr_mobile_ui/
echo "上传dist到线上服务器成功"
