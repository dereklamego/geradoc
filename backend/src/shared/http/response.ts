export const response = {
    success: (data: any, statusCode = 200) => ({
        statusCode,
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    }),

    error: (message: string, statusCode = 400, code = 'BAD_REQUEST', issues: any[] = []) => ({
        statusCode,
        body: JSON.stringify({
            error: statusCode === 500 ? 'Internal Server Error' : 'Error',
            message,
            code,
            issues,
        }),
        headers: { 'Content-Type': 'application/json' },
    }),
};
