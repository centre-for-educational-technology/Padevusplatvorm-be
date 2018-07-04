function generateResponse(callback){
	const base = {
		userMessage: '',
		error: '',
		data: null
	};
	callback(base);
}

function generateErrorResponse(callback){
	const base = {
		userMessage: 'Something went wrong. If the problem persists please contact the administrator.',
		error: '',
		data: null
	};
	callback(base);
}


module.exports = {
	generateResponse,
	generateErrorResponse
};