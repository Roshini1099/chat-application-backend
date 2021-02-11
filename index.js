const dotenv = require('dotenv');
dotenv.config();

var port = process.env.PORT || 3333;

app.listen(port, () => {
    console.log('Chat Application is listening on port ' + port);
});

