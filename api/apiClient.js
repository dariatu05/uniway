import { MOCK_ROUTES } from '../data/mockRoutes';

export const apiClient = {
    searchRoutes: async (startort, zielort) => {
        console.log(`Tickets suchen: ${startort} -> ${zielort}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                // Server anfragen würden hier stattfinden, z.B.:
                // const response = await fetch('https://api.oebb.at/...');
                // const data = await response.json();

                resolve(MOCK_ROUTES);
            }, 1500);
        });
    }
};