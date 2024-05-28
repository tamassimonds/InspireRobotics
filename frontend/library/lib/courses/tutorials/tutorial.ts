







export type Tutorial = {
    title: string;
    link: string;
    id: string;
}

export function db_to_tutorial(data: any): Tutorial {
    // Validate that all required fields are provided and are not undefined
    if (!data) {
        throw new Error('Data is undefined or null');
    }

    if (typeof data.title !== 'string' || data.title.trim() === '') {
        throw new Error('Title is required and must be a non-empty string');
    }

    if (typeof data.link !== 'string' || data.link.trim() === '') {
        throw new Error('Link is required and must be a non-empty string');
    }

    if (typeof data.id !== 'string' || data.id.trim() === '') {
        throw new Error('ID is required and must be a non-empty string');
    }

    // If validation passes, return the Tutorial object
    return {
        title: data.title,
        link: data.link,
        id: data.id
    };
}