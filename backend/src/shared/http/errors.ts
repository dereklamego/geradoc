export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode = 400,
        public code = 'BAD_REQUEST',
        public issues: any[] = []
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: any) => {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({
                error: error.name,
                message: error.message,
                code: error.code,
                issues: error.issues,
            }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    console.error('[Error]:', error);

    return {
        statusCode: 500,
        body: JSON.stringify({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
            code: 'INTERNAL_SERVER_ERROR',
        }),
        headers: { 'Content-Type': 'application/json' },
    };
};
