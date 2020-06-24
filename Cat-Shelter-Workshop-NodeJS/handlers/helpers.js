module.exports = {
    errorGetHandler(error) {
        if (error) {

            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write('Whoops! File not found!');
            res.end();
            return;
        }
    },
    errorPostHandler(error) {
        if (error) {
            console.log(error);
            throw error;
        }
    }
}

