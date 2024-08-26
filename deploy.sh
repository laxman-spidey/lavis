env=$1
echo $env
APP_PATH=`pwd`
HOST="root@128.199.28.60" #Dev
PRIVATE_KEY="$APP_PATH/stonefactory.pem"
# SERVER_PATH="$APP_PATH/server"
CLIENT_APP_PATH="$APP_PATH/client"




##Backend deployment
# cd $SERVER_PATH && npm install && npm run build:prod
# rsync -avz --exclude 'dbdump' --exclude 'client' --exclude 'node_modules' --exclude 'build' --exclude 'logs' -r $SERVER_PATH/* -e "ssh -i $PRIVATE_KEY" $HOST:~/carwash


##client deployment
cd $CLIENT_APP_PATH && npm install && npm run build
rsync -avz -r $CLIENT_APP_PATH/dist/* -e "ssh -i $PRIVATE_KEY" $HOST:/var/www/html


ssh -i $PRIVATE_KEY $HOST 'systemctl restart nginx'

# ssh -i $PRIVATE_KEY $HOST 'pm2 restart ~/carwash/index.js'
# ssh -i $PRIVATE_KEY $HOST 'pm2 remove all'
# ssh -i $PRIVATE_KEY $HOST 'pm2 restart 0'
# ssh -i $PRIVATE_KEY $HOST 'pm2 start npm -- start'
# ssh -i $PRIVATE_KEY $HOST


